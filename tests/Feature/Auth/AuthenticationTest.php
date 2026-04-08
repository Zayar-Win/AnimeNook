<?php

use App\Models\Group;
use App\Models\User;

test('main-domain login URL redirects to group login', function () {
    $sub = config('auth.default_group_subdomain');

    $response = $this->get('/login');

    $response->assertRedirect(route('group.login', ['group' => $sub]));
});

test('users can authenticate via group login', function () {
    $sub = config('auth.default_group_subdomain');
    $group = Group::factory()->create(['subdomain' => $sub]);
    $user = User::factory()->create([
        'group_id' => $group->id,
        'email' => 'auth-test@example.com',
    ]);

    $response = $this->post('/'.$sub.'/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('group.home', ['group' => $sub]));
});

test('users can not authenticate with invalid password', function () {
    $sub = config('auth.default_group_subdomain');
    $group = Group::factory()->create(['subdomain' => $sub]);
    $user = User::factory()->create([
        'group_id' => $group->id,
    ]);

    $this->post('/'.$sub.'/login', [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $this->assertGuest();
});

test('users can logout', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/logout');

    $this->assertGuest();
    $response->assertRedirect('/');
});
