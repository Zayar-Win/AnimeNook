<?php

namespace App\Console\Commands;

use App\Models\AdsenseReport;
use App\Models\Group;
use App\Services\Adsense\AdsenseReportSyncService;
use Carbon\Carbon;
use Illuminate\Console\Command;

class SyncAdsenseReports extends Command
{
    protected $signature = 'adsense:sync {--from= : Override start date (Y-m-d)} {--to= : Override end date (Y-m-d, defaults to yesterday)}';

    protected $description = 'Sync AdSense reports from the last synced date up to yesterday';

    public function handle(AdsenseReportSyncService $service): int
    {
        try {
            $yesterday = Carbon::yesterday();

            $groups = Group::query()->orderBy('subdomain')->get(['id', 'subdomain']);

            // Latest synced date per group
            $latestByGroup = AdsenseReport::query()
                ->selectRaw('group_id, MAX(report_date) as latest_date')
                ->groupBy('group_id')
                ->pluck('latest_date', 'group_id');

            // Show current status
            $this->newLine();
            $this->info('Current sync status per group:');
            $this->table(
                ['Group', 'Latest Synced Date'],
                $groups->map(fn ($g) => [
                    $g->subdomain,
                    $latestByGroup[$g->id] ?? '(no data)',
                ])->all()
            );

            // Determine date range
            if ($this->option('from')) {
                $startDate = Carbon::parse((string) $this->option('from'));
            } else {
                // Use the oldest "latest date" across all groups so no group falls behind
                $oldestLatest = $latestByGroup->min();

                if ($oldestLatest === null) {
                    // No data at all — default to last 30 days
                    $startDate = $yesterday->copy()->subDays(29);
                    $this->line('No existing data found. Defaulting to last 30 days.');
                } else {
                    $startDate = Carbon::parse($oldestLatest)->addDay();
                }
            }

            $endDate = $this->option('to')
                ? Carbon::parse((string) $this->option('to'))
                : $yesterday;

            if ($startDate->isAfter($endDate)) {
                $this->info('Already up to date. Latest data is from ' . $endDate->toDateString() . '.');
                return self::SUCCESS;
            }

            $this->newLine();
            $this->info(sprintf(
                'Syncing from %s to %s...',
                $startDate->toDateString(),
                $endDate->toDateString()
            ));

            $result = $service->syncRange($startDate, $endDate);

            // Show per-group results
            $this->newLine();
            $this->info('Sync complete. Rows written per group:');

            $byGroup = $result['by_group'] ?? [];
            $this->table(
                ['Group', 'Rows Synced', 'Latest Date Now'],
                $groups->map(function ($g) use ($byGroup, $endDate) {
                    $synced = $byGroup[$g->id] ?? 0;
                    $latestNow = $synced > 0
                        ? $endDate->toDateString()
                        : AdsenseReport::query()->where('group_id', $g->id)->max('report_date') ?? '(no data)';

                    return [$g->subdomain, $synced, $latestNow];
                })->all()
            );

            if ($result['skipped'] > 0) {
                $this->line("Skipped {$result['skipped']} row(s) with no matching group channel.");
            }

            return self::SUCCESS;
        } catch (\Throwable $e) {
            $this->error('AdSense sync failed: ' . $e->getMessage());
            return self::FAILURE;
        }
    }
}
