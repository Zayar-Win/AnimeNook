<?php

namespace Database\Seeders;

use App\Models\Chapter;
use App\Models\Manga;
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
            'title' => 'Episode Two'
        ])->create();
        Chapter::factory([
            'chapter_number' => 3,
            'like_count' => 100,
            'view_count' => 1000,
            'title' => 'Episode 3'
        ])->create();
        Chapter::factory([
            'chapter_number' => 4,
            'like_count' => 100,
            'view_count' => 1000,
            'title' => 'Episode Four'
        ])->create();
        Chapter::factory([
            'chapter_number' => 5,
            'like_count' => 100,
            'view_count' => 1000,
            'title' => 'Episode Five'
        ])->create();
        Chapter::factory([
            'chapter_number' => 1,
            'like_count' => 100,
            'view_count' => 1000,
            'title' => 'Episode One',
            'chapterable_type' => Manga::class,
            'chapterable_id' => 1,
        ])->create();
        Chapter::factory([
            'chapter_number' => 2,
            'like_count' => 100,
            'view_count' => 1000,
            'title' => 'Episode two',
            'chapterable_type' => Manga::class,
            'chapterable_id' => 1,
        ])->create();
        Chapter::factory([
            'chapter_number' => 3,
            'like_count' => 100,
            'view_count' => 1000,
            'title' => 'Episode three',
            'chapterable_type' => Manga::class,
            'chapterable_id' => 1,
        ])->create();
        Chapter::factory([
            'chapter_number' => 4,
            'like_count' => 100,
            'view_count' => 1000,
            'title' => 'Episode four',
            'chapterable_type' => Manga::class,
            'chapterable_id' => 1,
        ])->create();
    }
}
