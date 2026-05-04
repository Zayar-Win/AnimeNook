<?php

use App\Models\Chapter;
use App\Models\ChapterImage;
use App\Models\Group;
use App\Models\Manga;
use App\Models\Season;
use App\Models\Status;

/**
 * @return array{group: Group, manga: Manga, season: Season, chapter: Chapter}
 */
function createMangaChapterFixture(array $chapterOverrides = []): array
{
    $group = Group::factory()->create();
    $status = Status::factory()->create();
    $manga = Manga::factory()->create([
        'group_id' => $group->id,
        'status_id' => $status->id,
    ]);
    $season = Season::factory()->create([
        'group_id' => $group->id,
        'seasonable_id' => $manga->id,
        'seasonable_type' => Manga::class,
        'title' => 'Season One',
        'season_number' => 1,
    ]);
    $chapter = Chapter::factory()->create(array_merge([
        'group_id' => $group->id,
        'chapterable_id' => $manga->id,
        'chapterable_type' => Manga::class,
        'season_id' => $season->id,
        'chapter_number' => 1,
        'title' => 'Reader Fixture Chapter',
        'type' => 'link',
        'chapter_link' => null,
        'ouo_chapter_link' => null,
        'pdf_path' => null,
    ], $chapterOverrides));

    return compact('group', 'manga', 'season', 'chapter');
}

test('manga chapter reader returns ok with images mode and chapter options', function () {
    extract(createMangaChapterFixture());

    ChapterImage::query()->create([
        'chapter_id' => $chapter->id,
        'path' => 'https://example.test/page-1.png',
        'order' => 0,
    ]);

    $other = Chapter::factory()->create([
        'group_id' => $group->id,
        'chapterable_id' => $manga->id,
        'chapterable_type' => Manga::class,
        'season_id' => $season->id,
        'chapter_number' => 2,
        'title' => 'Second Chapter',
        'type' => 'link',
        'chapter_link' => null,
        'ouo_chapter_link' => null,
        'pdf_path' => null,
    ]);

    $url = '/'.$group->subdomain.'/mangas/'.$manga->slug.'/chapters/'.$chapter->id;

    $this->get($url)
        ->assertOk()
        ->assertViewHas('page', function (array $page) use ($chapter, $other) {
            expect($page['component'])->toBe('Group/MangaChapterReader');
            expect($page['props']['readerMode'])->toBe('images');
            expect($page['props']['chapter']['id'])->toBe($chapter->id);
            expect($page['props']['images'])->toBe(['https://example.test/page-1.png']);
            $options = $page['props']['chapterOptions'];
            expect($options)->toHaveCount(2);
            $ids = collect($options)->pluck('id')->all();
            expect($ids)->toContain($chapter->id)->toContain($other->id);
            expect($page['props']['prevChapterId'])->toBeNull();
            expect($page['props']['nextChapterId'])->toBe($other->id);

            return true;
        });
});

test('manga chapter reader uses pdf mode when chapter has pdf_path', function () {
    extract(createMangaChapterFixture([
        'pdf_path' => 'https://example.test/chapter.pdf',
    ]));

    $url = '/'.$group->subdomain.'/mangas/'.$manga->slug.'/chapters/'.$chapter->id;

    $this->get($url)
        ->assertOk()
        ->assertViewHas('page', function (array $page) {
            expect($page['props']['readerMode'])->toBe('pdf');

            return true;
        });
});

test('manga chapter reader returns not found when chapter belongs to another manga', function () {
    extract(createMangaChapterFixture());
    $status = Status::factory()->create();
    $otherManga = Manga::factory()->create([
        'group_id' => $group->id,
        'status_id' => $status->id,
    ]);

    $url = '/'.$group->subdomain.'/mangas/'.$otherManga->slug.'/chapters/'.$chapter->id;

    $this->get($url)->assertNotFound();
});

test('manga chapter reader returns not found when chapter is in a different group', function () {
    extract(createMangaChapterFixture());
    $otherGroup = Group::factory()->create();

    $url = '/'.$otherGroup->subdomain.'/mangas/'.$manga->slug.'/chapters/'.$chapter->id;

    $this->get($url)->assertNotFound();
});

test('guest is redirected to register for manga chapter reader when setting enabled', function () {
    extract(createMangaChapterFixture());
    $group->groupSetting->update([
        'require_login_for_manga' => true,
    ]);

    $url = '/'.$group->subdomain.'/mangas/'.$manga->slug.'/chapters/'.$chapter->id;

    $this->get($url)->assertRedirect('/'.$group->subdomain.'/register');
});

test('authenticated member can access chapter reader when setting enabled', function () {
    extract(createMangaChapterFixture());
    $group->groupSetting->update([
        'require_login_for_manga' => true,
    ]);
    $user = \App\Models\User::factory()->create([
        'group_id' => $group->id,
    ]);

    $url = '/'.$group->subdomain.'/mangas/'.$manga->slug.'/chapters/'.$chapter->id;

    $this->actingAs($user)
        ->get($url)
        ->assertOk();
});
