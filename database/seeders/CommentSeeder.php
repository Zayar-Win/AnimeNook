<?php

namespace Database\Seeders;

use App\Models\Anime;
use App\Models\Comment;
use App\Models\Manga;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CommentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Comment::factory(4, [
            'commentable_id' => 3,
            'commentable_type' => Anime::class,
        ])->create();
        Comment::factory(4, [
            'commentable_id' => 1,
            'commentable_type' => Anime::class,
        ])->create();
        Comment::factory(4, [
            'commentable_id' => 2,
            'commentable_type' => Anime::class,
        ])->create();
        Comment::factory(4, [
            'commentable_id' => 3,
            'commentable_type' => Manga::class,
        ])->create();
        Comment::factory(4, [
            'commentable_id' => 1,
            'commentable_type' => Manga::class,
        ])->create();
        Comment::factory(4, [
            'commentable_id' => 2,
            'commentable_type' => Manga::class,
        ])->create();
    }
}
