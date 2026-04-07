<?php

namespace Database\Factories;

use App\Models\Group;
use App\Models\Status;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Manga>
 */
class MangaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'group_id' => Group::factory(),
            'name' => $this->faker->unique()->sentence(3),
            'description' => $this->faker->paragraph(),
            'thumbnail' => 'https://example.test/thumb.jpg',
            'rating' => $this->faker->numberBetween(1, 5),
            'status_id' => Status::factory(),
            'views_count' => 0,
            'likes_count' => 0,
        ];
    }
}
