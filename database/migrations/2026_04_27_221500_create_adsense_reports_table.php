<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('adsense_reports', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('group_id');
            $table->date('report_date');
            $table->decimal('estimated_earnings', 12, 2)->default(0);
            $table->unsignedBigInteger('impressions')->default(0);
            $table->unsignedBigInteger('clicks')->default(0);
            $table->unsignedBigInteger('page_views')->default(0);
            $table->decimal('ctr', 8, 4)->default(0);
            $table->decimal('rpm', 10, 4)->default(0);
            $table->timestamps();

            $table->unique(['group_id', 'report_date']);
            $table->index(['group_id', 'report_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('adsense_reports');
    }
};

