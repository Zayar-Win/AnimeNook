<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('group_settings', function (Blueprint $table) {
            $table->boolean('require_login_for_manga')->default(false)->after('primary_color');
        });
    }

    public function down(): void
    {
        Schema::table('group_settings', function (Blueprint $table) {
            $table->dropColumn('require_login_for_manga');
        });
    }
};
