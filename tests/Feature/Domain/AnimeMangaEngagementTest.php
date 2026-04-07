<?php

use App\Models\Anime;
use App\Models\Group;
use App\Models\Manga;
use App\Models\Status;

test('anime detail returns ok for slug in group', function () {
    $group = Group::factory()->create();
    $status = Status::factory()->create();
    $anime = Anime::factory()->create(['group_id' => $group->id, 'status_id' => $status->id]);

    $this->get('/'.$group->subdomain.'/animes/'.$anime->slug)->assertOk();
});

test('anime detail 404 for slug in different group', function () {
    $groupA = Group::factory()->create();
    $groupB = Group::factory()->create();
    $status = Status::factory()->create();
    $anime = Anime::factory()->create(['group_id' => $groupB->id, 'status_id' => $status->id]);

    $this->get('/'.$groupA->subdomain.'/animes/'.$anime->slug)->assertNotFound();
});

test('guest cannot like anime', function () {
    $group = Group::factory()->create();
    $status = Status::factory()->create();
    $anime = Anime::factory()->create(['group_id' => $group->id, 'status_id' => $status->id]);

    $this->post('/'.$group->subdomain.'/animes/'.$anime->slug.'/like')->assertRedirect();
});

test('member can like anime', function () {
    ['group' => $group, 'user' => $user] = createGroupWithUser();
    $status = Status::factory()->create();
    $anime = Anime::factory()->create(['group_id' => $group->id, 'status_id' => $status->id]);

    $this->actingAs($user)
        ->from('/'.$group->subdomain.'/animes/'.$anime->slug)
        ->post('/'.$group->subdomain.'/animes/'.$anime->slug.'/like')
        ->assertRedirect();
});

test('member can submit anime rating', function () {
    ['group' => $group, 'user' => $user] = createGroupWithUser();
    $status = Status::factory()->create();
    $anime = Anime::factory()->create(['group_id' => $group->id, 'status_id' => $status->id]);

    $this->actingAs($user)
        ->post('/'.$group->subdomain.'/animes/'.$anime->id.'/rating', [
            'rating' => 5,
        ])
        ->assertRedirect();
});

test('manga detail returns ok', function () {
    $group = Group::factory()->create();
    $status = Status::factory()->create();
    $manga = Manga::factory()->create(['group_id' => $group->id, 'status_id' => $status->id]);

    $this->get('/'.$group->subdomain.'/mangas/'.$manga->slug)->assertOk();
});
