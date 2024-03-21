<?php

namespace Database\Seeders;

use App\Models\Status;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Status::factory([
            'name' => 'Ongoing',
            'keyword' => 'ongoing'
        ])->create();
        Status::factory([
            'name' => 'Completed',
            'keyword' => 'completed'
        ])->create();
        Status::factory([
            'name' => 'Announced',
            'keyword' => 'announced'
        ])->create();
    }
}
