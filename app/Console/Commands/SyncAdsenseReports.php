<?php

namespace App\Console\Commands;

use App\Services\Adsense\AdsenseReportSyncService;
use Carbon\Carbon;
use Illuminate\Console\Command;

class SyncAdsenseReports extends Command
{
    protected $signature = 'adsense:sync {--date=} {--days=1}';

    protected $description = 'Sync AdSense reports from API into local database';

    public function handle(AdsenseReportSyncService $service): int
    {
        try {
            $dateOption = $this->option('date');
            $days = max(1, (int) $this->option('days'));

            $endDate = $dateOption ? Carbon::parse((string) $dateOption) : Carbon::yesterday();
            $startDate = $endDate->copy()->subDays($days - 1);

            $this->info(sprintf(
                'Syncing AdSense reports from %s to %s',
                $startDate->toDateString(),
                $endDate->toDateString()
            ));

            $result = $service->syncRange($startDate, $endDate);

            $this->info("Synced rows: {$result['synced']}");
            $this->info("Skipped rows (channel unmatched): {$result['skipped']}");

            return self::SUCCESS;
        } catch (\Throwable $e) {
            $this->error('AdSense sync failed: ' . $e->getMessage());
            return self::FAILURE;
        }
    }
}

