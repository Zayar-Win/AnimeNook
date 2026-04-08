<?php

use App\Models\Group;
use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Notification;

test('forgot password screen can be rendered on group tenant', function () {
    $group = Group::factory()->create();

    $response = $this->get('/'.$group->subdomain.'/forgot-password');

    $response->assertStatus(200);
});

test('reset password link can be requested for user in group', function () {
    Notification::fake();

    $group = Group::factory()->create();
    $user = User::factory()->create(['group_id' => $group->id]);

    $this->post('/'.$group->subdomain.'/forgot-password', ['email' => $user->email]);

    Notification::assertSentTo($user, ResetPassword::class);
});

test('reset password screen can be rendered with token', function () {
    Notification::fake();

    $group = Group::factory()->create();
    $user = User::factory()->create(['group_id' => $group->id]);

    $this->post('/'.$group->subdomain.'/forgot-password', ['email' => $user->email]);

    Notification::assertSentTo($user, ResetPassword::class, function ($notification) use ($group, $user) {
        $response = $this->get('/'.$group->subdomain.'/reset-password/'.$notification->token.'?email='.urlencode($user->email));

        $response->assertStatus(200);

        return true;
    });
});

test('password can be reset with valid token', function () {
    Notification::fake();

    $group = Group::factory()->create();
    $user = User::factory()->create(['group_id' => $group->id]);

    $this->post('/'.$group->subdomain.'/forgot-password', ['email' => $user->email]);

    Notification::assertSentTo($user, ResetPassword::class, function ($notification) use ($group, $user) {
        $response = $this->post('/'.$group->subdomain.'/reset-password', [
            'token' => $notification->token,
            'email' => $user->email,
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertSessionHasNoErrors();

        return true;
    });
});
