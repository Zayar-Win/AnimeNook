<?php

namespace App\Services\Adsense;

use App\Models\Group;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class AdsenseReportSyncService
{
    public function syncRange(Carbon $startDate, Carbon $endDate): array
    {
        $rows = $this->fetchReportRows($startDate, $endDate);
        if (empty($rows)) {
            return ['synced' => 0, 'skipped' => 0];
        }

        $groups = Group::query()->get(['id', 'subdomain']);
        $groupByChannel = $groups
            ->mapWithKeys(function (Group $group) {
                return [$this->buildExpectedChannelHost($group->subdomain) => $group->id];
            })
            ->all();

        $toUpsert = [];
        $skipped = 0;

        foreach ($rows as $row) {
            $groupId = $groupByChannel[$row['channel_host']] ?? null;
            if ($groupId === null) {
                $skipped++;
                continue;
            }

            $clicks = (int) $row['clicks'];
            $pageViews = (int) $row['page_views'];
            $earnings = (float) $row['estimated_earnings'];

            $ctr = $pageViews > 0 ? ($clicks / $pageViews) * 100 : 0;
            $rpm = $pageViews > 0 ? ($earnings / $pageViews) * 1000 : 0;

            $toUpsert[] = [
                'group_id' => $groupId,
                'report_date' => $row['date'],
                'estimated_earnings' => round($earnings, 2),
                'impressions' => (int) $row['impressions'],
                'clicks' => $clicks,
                'page_views' => $pageViews,
                'ctr' => round($ctr, 4),
                'rpm' => round($rpm, 4),
                'updated_at' => now(),
                'created_at' => now(),
            ];
        }

        if (! empty($toUpsert)) {
            DB::table('adsense_reports')->upsert(
                $toUpsert,
                ['group_id', 'report_date'],
                ['estimated_earnings', 'impressions', 'clicks', 'page_views', 'ctr', 'rpm', 'updated_at']
            );
        }

        return ['synced' => count($toUpsert), 'skipped' => $skipped];
    }

    private function fetchReportRows(Carbon $startDate, Carbon $endDate): array
    {
        $token = $this->accessToken();
        $account = $this->normalizeAccountId((string) config('services.adsense.account_id'));
        if (! $account) {
            throw new RuntimeException('AdSense account id is missing.');
        }

        $baseQuery = http_build_query([
            'startDate.year' => $startDate->year,
            'startDate.month' => $startDate->month,
            'startDate.day' => $startDate->day,
            'endDate.year' => $endDate->year,
            'endDate.month' => $endDate->month,
            'endDate.day' => $endDate->day,
        ]);
        $repeatQuery = implode('&', [
            'dimensions=DATE',
            'dimensions=URL_CHANNEL_NAME',
            'metrics=ESTIMATED_EARNINGS',
            'metrics=IMPRESSIONS',
            'metrics=CLICKS',
            'metrics=PAGE_VIEWS',
        ]);
        $url = "https://adsense.googleapis.com/v2/{$account}/reports:generate?{$baseQuery}&{$repeatQuery}";

        $response = Http::withToken($token)
            ->acceptJson()
            ->get($url);

        if (! $response->successful()) {
            throw new RuntimeException('AdSense report request failed: ' . $response->body());
        }

        $rows = $response->json('rows') ?? [];
        if (! is_array($rows)) {
            return [];
        }

        return collect($rows)
            ->map(function ($row) {
                $cells = collect($row['cells'] ?? [])->pluck('value')->values();
                if ($cells->count() < 6) {
                    return null;
                }

                $channel = (string) $cells->get(1, '');

                return [
                    'date' => Carbon::parse((string) $cells->get(0))->toDateString(),
                    'channel_host' => $this->normalizeChannelHost($channel),
                    'estimated_earnings' => (float) $cells->get(2, 0),
                    'impressions' => (int) $cells->get(3, 0),
                    'clicks' => (int) $cells->get(4, 0),
                    'page_views' => (int) $cells->get(5, 0),
                ];
            })
            ->filter()
            ->all();
    }

    private function accessToken(): string
    {
        $clientId = config('services.adsense.client_id');
        $clientSecret = config('services.adsense.client_secret');
        $refreshToken = config('services.adsense.refresh_token');

        if (! $clientId || ! $clientSecret || ! $refreshToken) {
            throw new RuntimeException('AdSense OAuth credentials are missing.');
        }

        $response = Http::asForm()->post('https://oauth2.googleapis.com/token', [
            'client_id' => $clientId,
            'client_secret' => $clientSecret,
            'refresh_token' => $refreshToken,
            'grant_type' => 'refresh_token',
        ]);

        if (! $response->successful()) {
            throw new RuntimeException('Failed to refresh AdSense access token: ' . $response->body());
        }

        $token = (string) ($response->json('access_token') ?? '');
        if ($token === '') {
            throw new RuntimeException('AdSense access token is empty.');
        }

        return $token;
    }

    private function buildExpectedChannelHost(string $subdomain): string
    {
        $base = (string) config('services.adsense.channel_base_domain', 'animenook.net');
        return $this->normalizeChannelHost($subdomain . '.' . $base);
    }

    private function normalizeChannelHost(string $value): string
    {
        $raw = strtolower(trim($value));
        if ($raw === '') {
            return '';
        }

        if (! str_contains($raw, '://')) {
            $raw = 'https://' . $raw;
        }

        $host = (string) parse_url($raw, PHP_URL_HOST);
        if ($host === '') {
            $host = preg_replace('/\/.*$/', '', preg_replace('/^https?:\/\//', '', $raw)) ?? '';
        }

        return preg_replace('/^www\./', '', $host) ?? $host;
    }

    private function normalizeAccountId(string $accountId): string
    {
        $value = trim($accountId);
        if ($value === '') {
            return '';
        }

        if (str_starts_with($value, 'accounts/')) {
            return $value;
        }

        if (str_starts_with($value, 'pub-')) {
            return 'accounts/' . $value;
        }

        return $value;
    }
}

