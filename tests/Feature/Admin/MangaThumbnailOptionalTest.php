<?php

use App\helpers\Uploader;
use App\Models\Chapter;
use App\Models\Manga;
use App\Models\Season;
use App\Models\Status;
use App\Models\Tag;
use Illuminate\Http\UploadedFile;

test('group admin can create manga without thumbnail', function () {
    ['group' => $group, 'user' => $admin] = createGroupWithUser('admin');
    $group->update(['expire_date' => now()->addMonth()]);
    $status = Status::factory()->create();
    $tag = Tag::factory()->create(['group_id' => $group->id]);

    $this->actingAs($admin)
        ->post('/'.$group->subdomain.'/admin/mangas/store', [
            'name' => 'Manga Without Cover',
            'status_id' => $status->id,
            'description' => 'Synopsis text.',
            'tag_ids' => [
                ['value' => $tag->id, 'label' => $tag->name],
            ],
        ])
        ->assertRedirect(route('group.admin.mangas', ['group' => $group->subdomain]));

    $manga = Manga::query()->where('name', 'Manga Without Cover')->first();
    expect($manga)->not->toBeNull();
    expect($manga->thumbnail)->toBeNull();
});

test('group admin can create chapter without cover thumbnail when images are provided', function () {
    $this->instance(
        Uploader::class,
        \Mockery::mock(Uploader::class, function ($mock) {
            $mock->shouldReceive('upload')
                ->zeroOrMoreTimes()
                ->andReturnUsing(fn () => 'https://fake.test/'.uniqid('', true).'.png');
        })
    );

    ['group' => $group, 'user' => $admin] = createGroupWithUser('admin');
    $group->update(['expire_date' => now()->addMonth()]);
    $status = Status::factory()->create();
    $manga = Manga::factory()->create([
        'group_id' => $group->id,
        'status_id' => $status->id,
    ]);
    $season = Season::factory()->create([
        'group_id' => $group->id,
        'seasonable_id' => $manga->id,
        'seasonable_type' => Manga::class,
    ]);

    $pageImage = UploadedFile::fake()->image('page-1.png', 80, 120);

    $this->actingAs($admin)
        ->post('/'.$group->subdomain.'/admin/mangas/'.$manga->id.'/chapters/store', [
            'chapter_number' => 10,
            'title' => 'Chapter No Cover Thumb',
            'description' => 'Optional body.',
            'season_id' => $season->id,
            'content_mode' => 'images',
            'images' => [$pageImage],
        ])
        ->assertRedirect(route('group.admin.mangas.edit', ['group' => $group->subdomain, 'manga' => $manga->id]));

    $chapter = Chapter::query()->where('title', 'Chapter No Cover Thumb')->first();
    expect($chapter)->not->toBeNull();
    expect($chapter->thumbnail)->toBeNull();
    expect($chapter->images)->toHaveCount(1);
});
