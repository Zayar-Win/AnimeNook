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
        $group = $request->route('group');
        if (!is_object($group)) {
            $group = Group::where('subdomain', $group)->first();
        }
        return $request->expectsJson() ? null : route('group.login');
    }
}
