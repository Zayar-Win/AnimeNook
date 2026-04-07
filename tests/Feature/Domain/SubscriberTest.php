<?php

use App\Models\Group;
use App\Models\Subscriber;

test('visitor can subscribe with email', function () {
    $group = Group::factory()->create();

    $this->from('/'.$group->subdomain)
        ->post('/'.$group->subdomain.'/subscriber/store', [
            'email' => 'fan@example.com',
        ])
        ->assertRedirect()
        ->assertSessionHas('success');

    $this->assertDatabaseHas('subscribers', [
        'group_id' => $group->id,
        'email' => 'fan@example.com',
    ]);
});

test('duplicate subscriber email shows warning', function () {
    $group = Group::factory()->create();
    Subscriber::create([
        'group_id' => $group->id,
        'email' => 'dup@example.com',
    ]);

    $this->from('/'.$group->subdomain)
        ->post('/'.$group->subdomain.'/subscriber/store', [
            'email' => 'dup@example.com',
        ])
        ->assertRedirect()
        ->assertSessionHas('warning');
});
