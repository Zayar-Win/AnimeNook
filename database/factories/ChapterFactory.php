<?php

namespace Database\Factories;

use App\Models\Anime;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Chapter>
 */
class ChapterFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'group_id' => 1,
            'chapterable_id' => 1,
            'chapterable_type' => Anime::class,
            'chapter_number' => 1,
            'type' => 'link',
            'like_count' => 10,
            'view_count' => 1000,
            'description' => 'this is body',
            'name' => 'Episode One',
        ];
    }
}
