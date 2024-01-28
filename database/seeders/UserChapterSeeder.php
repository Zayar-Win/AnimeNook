<?php

namespace Database\Seeders;

use App\Models\UserChapter;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserChapterSeeder extends Seeder
{
    /**
     * Run the database seeds.kku
     */
    public function run(): void
    {
        UserChapter::factory([
            'chapter_id' => 2
        ])->create();
        UserChapter::factory([
            'chapter_id' => 3
        ])->create();
        UserChapter::factory([
            'chapter_id' => 4
        ])->create();
        UserChapter::factory([
            'chapter_id' => 5
        ])->create();
        UserChapter::factory([
            'chapter_id' => 6
        ])->create();
        UserChapter::factory([
            'chapter_id' => 7
        ])->create();
        UserChapter::factory([
            'chapter_id' => 8
        ])->create();
        UserChapter::factory([
            'chapter_id' => 9
        ])->create();
        UserChapter::factory([
            'chapter_id' => 10
        ])->create();
        UserChapter::factory([
            'chapter_id' => 1
        ])->create();
    }
}
