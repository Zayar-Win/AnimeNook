<?php

namespace App\Http\Middleware;

use App\Models\Group;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureMangaGuestAccess
{
    public function handle(Request $request, Closure $next): Response
    {
        $group = $request->route('group');
        if (!is_object($group) && is_string($group)) {
            $group = Group::where('subdomain', $group)->first();
        }
        if (!$group) {
            return $next($request);
        }

        $requiresLogin = (bool) optional($group?->groupSetting)->require_login_for_manga;
        if ($requiresLogin && !$request->user()) {
            return redirect()->guest(route('group.register', ['group' => $group->subdomain]));
        }

        return $next($request);
    }
}
