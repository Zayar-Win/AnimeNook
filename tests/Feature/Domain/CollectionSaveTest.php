<?php

use App\Models\Anime;
use App\Models\Group;
use App\Models\Status;

test('member can save anime to default collection', function () {
    ['group' => $group, 'user' => $user] = createGroupWithUser();
    $status = Status::factory()->create();
    $anime = Anime::factory()->create(['group_id' => $group->id, 'status_id' => $status->id]);
    $collection = $user->collections()->firstOrFail();

    $this->actingAs($user)
        ->from('/'.$group->subdomain.'/animes/'.$anime->slug)
        ->post('/'.$group->subdomain.'/collections/'.$collection->id.'/save', [
            'type' => 'anime',
            'id' => $anime->id,
        ])
        ->assertRedirect()
        ->assertSessionHas('success');

    $this->assertDatabaseHas('collection_items', [
        'collection_id' => $collection->id,
        'user_id' => $user->id,
        'item_id' => $anime->id,
    ]);
});

test('user cannot save to another users collection', function () {
    ['group' => $group, 'user' => $owner] = createGroupWithUser();
    ['user' => $intruder] = createGroupWithUser();
    $intruder->update(['group_id' => $group->id]);

    $status = Status::factory()->create();
    $anime = Anime::factory()->create(['group_id' => $group->id, 'status_id' => $status->id]);
    $collection = $owner->collections()->firstOrFail();

    $this->actingAs($intruder)
        ->post('/'.$group->subdomain.'/collections/'.$collection->id.'/save', [
            'type' => 'anime',
            'id' => $anime->id,
        ])
        ->assertForbidden();

    $this->assertDatabaseMissing('collection_items', [
        'collection_id' => $collection->id,
        'user_id' => $intruder->id,
    ]);
});
