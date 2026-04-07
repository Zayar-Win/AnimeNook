<?php

use App\Models\Anime;
use App\Models\Group;
use App\Models\Status;
use App\Models\User;

test('member can update own profile', function () {
    ['group' => $group, 'user' => $user] = createGroupWithUser();

    $this->actingAs($user)
        ->from('/'.$group->subdomain.'/user/profile')
        ->post('/'.$group->subdomain.'/user/profile/update', [
            'name' => 'Updated Name',
            'email' => $user->email,
            'profile_picture' => 'https://example.test/avatar.jpg',
        ])
        ->assertRedirect()
        ->assertSessionHas('success');

    expect($user->fresh()->name)->toBe('Updated Name');
});

test('public profile returns 404 for user from another group', function () {
    $groupA = Group::factory()->create();
    $groupB = Group::factory()->create();
    $userB = User::factory()->create(['group_id' => $groupB->id]);

    $this->get('/'.$groupA->subdomain.'/user/profile/'.$userB->id)->assertNotFound();
});

test('public profile ok for same group member', function () {
    ['group' => $group, 'user' => $member] = createGroupWithUser();
    ['user' => $viewer] = createGroupWithUser();
    $viewer->update(['group_id' => $group->id]);

    $this->actingAs($viewer)
        ->get('/'.$group->subdomain.'/user/profile/'.$member->id)
        ->assertOk();
});
