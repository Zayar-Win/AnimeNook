<?php

namespace Database\Seeders;

use App\Models\Season;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SeasonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Season::factory()->create(['seasonable_type' => 'App\Models\Anime','seasonable_id' => 1,'title' => 'Season One','season_number' => 1]);
        Season::factory()->create(['seasonable_type' => 'App\Models\Anime','seasonable_id' => 2,'title' => 'Season One','season_number' => 1]);
        Season::factory()->create(['seasonable_type' => 'App\Models\Manga','seasonable_id' => 1,'title' => 'Season One','season_number' => 1]);
        Season::factory()->create(['seasonable_type' => 'App\Models\Manga','seasonable_id' => 2,'title' => 'Season One','season_number' => 1]);
    }
}
