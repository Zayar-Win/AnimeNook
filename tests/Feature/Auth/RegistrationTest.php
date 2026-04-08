<?php

use App\Models\Group;

test('main-domain register URL redirects to group register', function () {
    $sub = config('auth.default_group_subdomain');

    $response = $this->get('/register');

    $response->assertRedirect(route('group.register', ['group' => $sub]));
});

test('new users can register via group register', function () {
    $sub = config('auth.default_group_subdomain');
    $group = Group::factory()->create(['subdomain' => $sub]);

    $response = $this->post('/'.$sub.'/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('group.home', ['group' => $sub]));
    $this->assertDatabaseHas('users', [
        'email' => 'test@example.com',
        'group_id' => $group->id,
    ]);
});
