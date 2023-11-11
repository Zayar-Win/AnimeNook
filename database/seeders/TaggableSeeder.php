<?php

namespace Database\Seeders;

use App\Models\Anime;
use App\Models\Manga;
use App\Models\Taggable;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TaggableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Taggable::factory(10)->create([
            'taggables_type' => Anime::class,
        ]);
        Taggable::factory(10)->create([
            'taggables_type' => Manga::class,
        ]);
    }
}
