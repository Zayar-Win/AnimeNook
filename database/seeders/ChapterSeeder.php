<?php

namespace Database\Seeders;

use App\Models\Chapter;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ChapterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Chapter::factory([])->create();
        Chapter::factory([
            'chapter_number' => 2,
            'like_count' => 100,
            'view_count' => 1000,
            'name' => 'Episode Two'
        ])->create();
        Chapter::factory([
            'chapter_number' => 3,
            'like_count' => 100,
            'view_count' => 1000,
            'name' => 'Episode 3'
        ])->create();
        Chapter::factory([
            'chapter_number' => 4,
            'like_count' => 100,
            'view_count' => 1000,
            'name' => 'Episode Four'
        ])->create();
        Chapter::factory([
            'chapter_number' => 5,
            'like_count' => 100,
            'view_count' => 1000,
            'name' => 'Episode Five'
        ])->create();
    }
}