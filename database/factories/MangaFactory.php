<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
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
            'group_id' => 1,
            'name' => $this->faker->name(),
            'description' => $this->faker->paragraph(),
            'thumbnail' => 'https://i0.wp.com/chatte-georgiana.com/wp-content/uploads/2014/10/naruto-volume-71-cover-release-databook-4-included-1859197.png?resize=800%2C1263&ssl=1',
            'rating' => $this->faker->numberBetween(1, 5),
            'status_id' => 1,
        ];
    }
}
