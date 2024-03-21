<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
        $this->call([
            GroupSeeder::class,
            UserSeeder::class,
            AnimeSeeder::class,
            MangaSeeder::class,
            TagSeeder::class,
            TaggableSeeder::class,
            ChapterSeeder::class,
            RoleSeeder::class,
            UserChapterSeeder::class,
            CommentSeeder::class,
            StatusSeeder::class,
            RatingSeeder::class
        ]);
    }
}
