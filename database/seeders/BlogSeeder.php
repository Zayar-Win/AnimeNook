<?php

namespace Database\Seeders;

use App\Models\Blog;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BlogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Blog::factory()->create([
            'image' => 'https://cdn.prod.website-files.com/65b0e179d4655faa9e6eedab/67866a4de4e06de6fadb1926_image%2030-p-1600.webp',
            'title' => 'The 4 Best Copywriting Blogs to Follow',
            'content' => ''
        ]);
    }
}
