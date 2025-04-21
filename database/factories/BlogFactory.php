<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Blog>
 */
class BlogFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->realText(30),
            'slug' => $this->faker->slug,
            'image' => 'https://source.unsplash.com/random/800x600?blog,' . rand(1, 100),
            'content' => $this->faker->realText(2000),
            'views' => $this->faker->numberBetween(0, 100),
            'author_id' => $this->faker->numberBetween(1, 10),
        ];
    }
}
