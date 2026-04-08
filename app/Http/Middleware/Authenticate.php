<?php

namespace App\Http\Middleware;

use App\Models\Group;
use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        if ($request->expectsJson()) {
            return null;
        }

        $group = $request->route('group');
        if (is_object($group) && $group instanceof Group) {
            return route('group.login', ['group' => $group->subdomain]);
        }
        if (is_string($group) && $group !== '') {
            return route('group.login', ['group' => $group]);
        }

        $resolved = Group::where('subdomain', $group)->first();
        if ($resolved) {
            return route('group.login', ['group' => $resolved->subdomain]);
        }

        return route('group.login', [
            'group' => config('auth.default_group_subdomain'),
        ]);
    }
}
