<?php

namespace Database\Seeders;

use App\Models\Tag;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Tag::factory()->create([
            'name' => 'Action'
        ]);
        Tag::factory()->create([
            'name' => 'Drama'
        ]);
        Tag::factory()->create([
            'name' => 'School'
        ]);
        Tag::factory()->create([
            'name' => 'Comedy'
        ]);
        Tag::factory()->create([
            'name' => 'Adventure'
        ]);
        Tag::factory()->create([
            'name' => 'Super Power'
        ]);
        Tag::factory()->create([
            'name' => 'Romance'
        ]);
        Tag::factory()->create([
            'name' => 'Science'
        ]);
        Tag::factory()->create([
            'name' => 'Fantasy'
        ]);
    }
}
