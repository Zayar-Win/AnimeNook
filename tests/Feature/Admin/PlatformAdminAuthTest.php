<?php

use App\Models\User;

test('guest cannot access platform admin dashboard', function () {
    $this->get('/admin/dashboard')->assertRedirect(route('login'));
});

test('authenticated user can access platform admin dashboard', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/admin/dashboard')
        ->assertOk();
});
