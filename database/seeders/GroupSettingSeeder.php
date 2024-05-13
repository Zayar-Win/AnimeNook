<?php

namespace Database\Seeders;

use App\Models\GroupSetting;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GroupSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $social_links = [
            'facebook' => '',
            'youtube' => '',
            'telegram' => '',
            'titok' => ''
        ];
        GroupSetting::factory()->create([
            'primary_color' => '#F47521',
            'social_links' => json_encode($social_links)
        ]);
    }
}
