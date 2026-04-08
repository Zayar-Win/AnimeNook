<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('mangas')) {
            return;
        }

        $driver = DB::getDriverName();

        if ($driver === 'mysql' || $driver === 'mariadb') {
            DB::statement('ALTER TABLE mangas MODIFY thumbnail VARCHAR(255) NULL');

            return;
        }

        if ($driver === 'pgsql') {
            DB::statement('ALTER TABLE mangas ALTER COLUMN thumbnail DROP NOT NULL');
        }
    }

    public function down(): void
    {
        if (! Schema::hasTable('mangas')) {
            return;
        }

        $driver = DB::getDriverName();

        if ($driver === 'mysql' || $driver === 'mariadb') {
            DB::statement('UPDATE mangas SET thumbnail = \'\' WHERE thumbnail IS NULL');
            DB::statement('ALTER TABLE mangas MODIFY thumbnail VARCHAR(255) NOT NULL');

            return;
        }

        if ($driver === 'pgsql') {
            DB::statement('UPDATE mangas SET thumbnail = \'\' WHERE thumbnail IS NULL');
            DB::statement('ALTER TABLE mangas ALTER COLUMN thumbnail SET NOT NULL');
        }
    }
};
