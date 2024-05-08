<?php

namespace Database\Seeders;

use App\Models\Plan;
use Database\Factories\PlanFactory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Plan::factory()->create([
            'name' => 'basic'
        ]);
        Plan::factory()->create([
            'name' => 'premium'
        ]);
    }
}
