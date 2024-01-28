<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class AnimeFactory extends Factory
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
            'name' => $this->faker->name(),
            'description' => $this->faker->paragraph(),
            'thumbnail' => $this->faker->image(),
            'rating' => $this->faker->numberBetween(1, 5),
            'status_id' => 1,
        ];
    }
}
