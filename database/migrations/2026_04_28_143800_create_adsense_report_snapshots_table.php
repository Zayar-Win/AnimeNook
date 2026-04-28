<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('adsense_report_snapshots', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('group_id');
            $table->string('period_type', 20);
            $table->date('period_start_date');
            $table->date('period_end_date');
            $table->decimal('estimated_earnings', 12, 2)->default(0);
            $table->unsignedBigInteger('impressions')->default(0);
            $table->unsignedBigInteger('clicks')->default(0);
            $table->unsignedBigInteger('page_views')->default(0);
            $table->decimal('ctr', 8, 4)->default(0);
            $table->decimal('rpm', 10, 4)->default(0);
            $table->unsignedInteger('rows_count')->default(0);
            $table->timestamps();

            $table->unique(['group_id', 'period_type', 'period_start_date', 'period_end_date'], 'adsense_snapshot_unique');
            $table->index(['group_id', 'period_type', 'period_end_date'], 'adsense_snapshot_lookup');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('adsense_report_snapshots');
    }
};

