<?php

namespace App\Support;

use App\Models\Group;

class GroupRoute
{
    public static function url(Group $group, string $name, array $parameters = []): string
    {
        return route($name, array_merge(['group' => $group->subdomain], $parameters));
    }
}
