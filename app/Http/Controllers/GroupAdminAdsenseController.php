<?php

namespace App\Http\Controllers;

use App\Models\AdsenseReport;
use App\Models\Group;
use Carbon\Carbon;
use Carbon\CarbonPeriod;

class GroupAdminAdsenseController extends Controller
{
    private const PUBLISHER_SHARE = 0.70;

    public function index(Group $group)
    {
        $today = Carbon::today();
        $defaultRangeStart = $today->copy()->subDays(29)->startOfDay();
        $defaultRangeEnd = $today->copy()->endOfDay();

        $requestedStartDate = request()->string('start_date')->toString();
        $requestedEndDate = request()->string('end_date')->toString();
        $requestedRange = request()->string('range')->toString();

        $rangeStart = $defaultRangeStart->copy();
        $rangeEnd = $defaultRangeEnd->copy();
        $selectedStartDate = null;
        $selectedEndDate = null;
        $selectedRangeLabel = 'Last 30 days';
        $selectedRangeKey = 'last_30_days';

        if ($requestedRange !== '') {
            if ($requestedRange === 'today') {
                $rangeStart = $today->copy()->startOfDay();
                $rangeEnd = $today->copy()->endOfDay();
                $selectedRangeLabel = 'Today';
                $selectedRangeKey = 'today';
            } elseif ($requestedRange === 'last_7_days') {
                $rangeStart = $today->copy()->subDays(6)->startOfDay();
                $rangeEnd = $today->copy()->endOfDay();
                $selectedRangeLabel = 'Last 7 days';
                $selectedRangeKey = 'last_7_days';
            } elseif ($requestedRange === 'last_30_days') {
                $rangeStart = $today->copy()->subDays(29)->startOfDay();
                $rangeEnd = $today->copy()->endOfDay();
                $selectedRangeLabel = 'Last 30 days';
                $selectedRangeKey = 'last_30_days';
            }
        }

        if ($requestedStartDate !== '' && $requestedEndDate !== '') {
            try {
                $customStart = Carbon::parse($requestedStartDate)->startOfDay();
                $customEnd = Carbon::parse($requestedEndDate)->endOfDay();

                if ($customStart->lessThanOrEqualTo($customEnd)) {
                    $rangeStart = $customStart;
                    $rangeEnd = $customEnd;
                    $selectedStartDate = $customStart->toDateString();
                    $selectedEndDate = $customEnd->toDateString();
                    $selectedRangeLabel = $customStart->format('M d, Y') . ' - ' . $customEnd->format('M d, Y');
                    $selectedRangeKey = 'custom';
                }
            } catch (\Throwable $e) {
                // Fallback to default range when date parsing fails.
            }
        }

        $rawSeries = AdsenseReport::query()
            ->where('group_id', $group->id)
            ->selectRaw('report_date as day, SUM(estimated_earnings) as earnings, SUM(impressions) as impressions, SUM(clicks) as clicks, SUM(page_views) as page_views')
            ->whereBetween('report_date', [$rangeStart->toDateString(), $rangeEnd->toDateString()])
            ->groupBy('day')
            ->pluck('earnings', 'day');

        $dailyNetEarnings = collect(CarbonPeriod::create($rangeStart->copy()->startOfDay(), $rangeEnd->copy()->startOfDay()))
            ->map(function (Carbon $date) use ($rawSeries) {
                $day = $date->toDateString();
                $net = (float) ($rawSeries[$day] ?? 0) * self::PUBLISHER_SHARE;

                return [
                    'date' => $day,
                    'label' => $date->format('M d'),
                    'earnings' => round($net, 2),
                ];
            })
            ->values();

        $dailyTotals = AdsenseReport::query()
            ->where('group_id', $group->id)
            ->whereBetween('report_date', [$rangeStart->toDateString(), $rangeEnd->toDateString()])
            ->selectRaw('COALESCE(SUM(estimated_earnings),0) as raw_earnings, COALESCE(SUM(impressions),0) as impressions, COALESCE(SUM(clicks),0) as clicks, COALESCE(SUM(page_views),0) as page_views')
            ->first();

        $rawEarnings = (float) ($dailyTotals->raw_earnings ?? 0);
        $impressions = (int) ($dailyTotals->impressions ?? 0);
        $clicks = (int) ($dailyTotals->clicks ?? 0);
        $pageViews = (int) ($dailyTotals->page_views ?? 0);

        $netEarnings = round($rawEarnings * self::PUBLISHER_SHARE, 2);
        $days = max(1, $rangeStart->diffInDays($rangeEnd) + 1);
        $avgDailyNet = round($netEarnings / $days, 2);

        $latestReports = AdsenseReport::query()
            ->where('group_id', $group->id)
            ->latest('report_date')
            ->take(12)
            ->get([
                'id',
                'report_date',
                'estimated_earnings',
                'impressions',
                'clicks',
                'page_views',
                'ctr',
                'rpm',
            ])
            ->map(function (AdsenseReport $report) {
                return [
                    'id' => $report->id,
                    'report_date' => optional($report->report_date)->toDateString(),
                    'net_earnings' => round((float) $report->estimated_earnings * self::PUBLISHER_SHARE, 2),
                    'impressions' => (int) $report->impressions,
                    'clicks' => (int) $report->clicks,
                    'page_views' => (int) $report->page_views,
                    'ctr' => (float) $report->ctr,
                    'rpm' => (float) $report->rpm,
                ];
            })
            ->values();

        return inertia('Group/Admin/AdsenseDashboard', [
            'summary' => [
                'net_earnings' => $netEarnings,
                'raw_earnings' => round($rawEarnings, 2),
                'avg_daily_net' => $avgDailyNet,
                'impressions' => $impressions,
                'clicks' => $clicks,
                'page_views' => $pageViews,
                'publisher_share_percent' => 70,
            ],
            'dailyNetEarnings' => $dailyNetEarnings,
            'latestReports' => $latestReports,
            'selectedStartDate' => $selectedStartDate,
            'selectedEndDate' => $selectedEndDate,
            'selectedRangeLabel' => $selectedRangeLabel,
            'selectedRangeKey' => $selectedRangeKey,
        ]);
    }
}
