<?php

namespace Database\Seeders;

use App\Models\Manga;
use App\Models\Rating;
use Illuminate\Database\Seeder;

class RatingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Rating::factory()->create();
        Rating::factory([
            'user_id' => 2,
            'rating' => 3,
            'ratingable_id' => 2,
        ])->create();
        Rating::factory([
            'user_id' => 3,
            'rating' => 3,
            'ratingable_id' => 2,
        ])->create();
        Rating::factory([
            'user_id' => 4,
            'rating' => 3,
            'ratingable_id' => 2,
        ])->create();
        Rating::factory([
            'user_id' => 5,
            'rating' => 3,
            'ratingable_id' => 2,
        ])->create();
        Rating::factory(['ratingable_type' => Manga::class])->create();
        Rating::factory([
            'user_id' => 2,
            'rating' => 3,
            'ratingable_id' => 2,
            'ratingable_type' => Manga::class
        ])->create();
        Rating::factory([
            'user_id' => 3,
            'rating' => 3,
            'ratingable_id' => 2,
            'ratingable_type' => Manga::class
        ])->create();
        Rating::factory([
            'user_id' => 4,
            'rating' => 3,
            'ratingable_id' => 2,
            'ratingable_type' => Manga::class
        ])->create();
        Rating::factory([
            'user_id' => 5,
            'rating' => 3,
            'ratingable_id' => 2,
            'ratingable_type' => Manga::class
        ])->create();
    }
}
