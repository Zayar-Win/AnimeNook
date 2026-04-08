<?php

namespace Database\Seeders;

use App\Models\Anime;
use App\Models\Chapter;
use App\Models\ChapterImage;
use App\Models\Group;
use App\Models\Manga;
use App\Models\Role;
use App\Models\Season;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Deterministic users and group-scoped content for Playwright e2e.
 * Run after RoleSeeder and GroupSeeder (e.g. `php artisan db:seed --class=E2ESeeder`).
 */
class E2ESeeder extends Seeder
{
    public function run(): void
    {
        $group = Group::where('subdomain', 'delta')->first();
        if (! $group) {
            $this->command?->warn('E2ESeeder: no group with subdomain "delta". Run GroupSeeder first.');

            return;
        }

        $userRole = Role::where('name', 'user')->first();
        $adminRole = Role::where('name', 'admin')->first();
        if (! $userRole || ! $adminRole) {
            $this->command?->warn('E2ESeeder: roles missing. Run RoleSeeder first.');

            return;
        }

        User::updateOrCreate(
            ['email' => 'e2e-user@example.test', 'group_id' => $group->id],
            [
                'name' => 'E2E User',
                'password' => 'password',
                'role_id' => $userRole->id,
                'profile_picture' => 'https://sb.kaleidousercontent.com/67418/1920x1545/c5f15ac173/samuel-raita-ridxdghg7pw-unsplash.jpg',
            ]
        );

        User::updateOrCreate(
            ['email' => 'e2e-admin@example.test', 'group_id' => $group->id],
            [
                'name' => 'E2E Admin',
                'password' => 'password',
                'role_id' => $adminRole->id,
                'profile_picture' => 'https://sb.kaleidousercontent.com/67418/1920x1545/c5f15ac173/samuel-raita-ridxdghg7pw-unsplash.jpg',
            ]
        );

        $anime = Anime::where('group_id', $group->id)
            ->where('name', 'E2E Anime Fixture')
            ->first();
        if (! $anime) {
            $anime = Anime::factory()->create([
                'group_id' => $group->id,
                'name' => 'E2E Anime Fixture',
                'is_trending' => true,
            ]);
            $season = Season::factory()->create([
                'group_id' => $group->id,
                'seasonable_id' => $anime->id,
                'seasonable_type' => Anime::class,
            ]);
            Chapter::factory()->create([
                'group_id' => $group->id,
                'chapterable_id' => $anime->id,
                'chapterable_type' => Anime::class,
                'season_id' => $season->id,
                'chapter_number' => 1,
                'type' => 'link',
                'chapter_link' => 'https://youtu.be/o5Bj--A9ORo',
                'ouo_chapter_link' => 'https://youtu.be/o5Bj--A9ORo',
                'title' => 'E2E Episode',
            ]);
        }

        $manga = Manga::where('group_id', $group->id)
            ->where('name', 'E2E Manga Fixture')
            ->first();
        if (! $manga) {
            $manga = Manga::factory()->create([
                'group_id' => $group->id,
                'name' => 'E2E Manga Fixture',
            ]);
            $season = Season::factory()->create([
                'group_id' => $group->id,
                'seasonable_id' => $manga->id,
                'seasonable_type' => Manga::class,
            ]);
            $mangaChapter = Chapter::factory()->create([
                'group_id' => $group->id,
                'chapterable_id' => $manga->id,
                'chapterable_type' => Manga::class,
                'season_id' => $season->id,
                'chapter_number' => 1,
                'type' => 'link',
                'chapter_link' => null,
                'ouo_chapter_link' => null,
                'title' => 'E2E Chapter',
            ]);
            ChapterImage::create([
                'chapter_id' => $mangaChapter->id,
                'path' => 'https://placehold.co/800x1200/1a1a1a/ed6400/png?text=E2E+Page+1',
                'order' => 0,
            ]);
        }
    }
}
