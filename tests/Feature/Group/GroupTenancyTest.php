<?php

use App\Models\Group;

test('unknown group subdomain returns 404', function () {
    $this->get('/not-a-real-subdomain-xyz')->assertNotFound();
});

test('valid group home returns ok', function () {
    $group = Group::factory()->create();

    $this->get('/'.$group->subdomain)->assertOk();
});

test('testing env exercises prefixed group routes not subdomain host routing', function () {
    expect(config('app.env'))->toBe('testing');
    $group = Group::factory()->create();
    $this->get('/'.$group->subdomain.'/animes')->assertOk();
});
