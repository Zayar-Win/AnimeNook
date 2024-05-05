<?php

use Carbon\Carbon;
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
        Schema::create('groups', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('subdomain');
            $table->unsignedBigInteger('setting_id')->nullable();
            $table->string('custom_domain')->nullable();
            $table->date('renewal_date')->nullable();
            $table->unsignedBigInteger('plan_id');
            $table->string('logo');
            $table->timestamp('start_date')->default(Carbon::now());
            $table->timestamp('expire_date')->default(Carbon::now()->addMonth(1));
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('groups');
    }
};
