<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Group>
 */
class GroupFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'name' => $this->faker->name(),
            'group_setting_id' => '1',
            'plan_id' => $this->faker->numberBetween(1, 2),
            'logo' => $this->faker->image(),
        ];
    }
}
