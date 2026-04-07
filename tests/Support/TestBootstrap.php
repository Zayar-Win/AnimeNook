<?php

namespace Tests\Support;

use App\Models\Role;

class TestBootstrap
{
    public static function seedRoles(): void
    {
        Role::query()->firstOrCreate(['name' => 'user']);
        Role::query()->firstOrCreate(['name' => 'admin']);
        Role::query()->firstOrCreate(['name' => 'editor']);
    }
}
