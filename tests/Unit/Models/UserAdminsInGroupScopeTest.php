<?php

use App\Models\Group;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

beforeEach(function () {
    \Tests\Support\TestBootstrap::seedRoles();
});

test('adminsInGroup returns only admin role users in group', function () {
    $group = Group::factory()->create();
    $adminRole = Role::query()->where('name', 'admin')->firstOrFail();
    $userRole = Role::query()->where('name', 'user')->firstOrFail();

    $admin = User::factory()->create([
        'group_id' => $group->id,
        'role_id' => $adminRole->id,
        'password' => 'password',
    ]);
    User::factory()->create([
        'group_id' => $group->id,
        'role_id' => $userRole->id,
        'password' => 'password',
    ]);

    $admins = User::adminsInGroup($group->id)->get();

    expect($admins)->toHaveCount(1);
    expect($admins->first()->is($admin))->toBeTrue();
});
