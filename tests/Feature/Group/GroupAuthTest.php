<?php

use App\Models\Group;
use App\Models\User;

test('guest can view group login page', function () {
    $group = Group::factory()->create();

    $this->get('/'.$group->subdomain.'/login')->assertOk();
});

test('member can log in with correct credentials', function () {
    ['group' => $group, 'user' => $user] = createGroupWithUser();

    $response = $this->post('/'.$group->subdomain.'/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response->assertRedirect(route('group.home', ['group' => $group->subdomain]));
    $this->assertAuthenticatedAs($user);
});

test('guest cannot access group profile', function () {
    $group = Group::factory()->create();

    $this->get('/'.$group->subdomain.'/user/profile')->assertRedirect();
});

test('authenticated user can access group profile', function () {
    ['group' => $group, 'user' => $user] = createGroupWithUser();

    $this->actingAs($user)
        ->get('/'.$group->subdomain.'/user/profile')
        ->assertOk();
});

test('user can register on group', function () {
    $group = Group::factory()->create();

    $response = $this->post('/'.$group->subdomain.'/register', [
        'name' => 'New Member',
        'email' => 'newmember@example.com',
        'password' => 'secret12',
    ]);

    $response->assertRedirect(route('group.home', ['group' => $group->subdomain]));
    $this->assertDatabaseHas('users', [
        'email' => 'newmember@example.com',
        'group_id' => $group->id,
    ]);
    $this->assertAuthenticated();
});
