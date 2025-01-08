<?php

namespace App\Http\Middleware;

use App\Models\Group;
use Carbon\Carbon;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SubscriptionMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {

        $group = request()->route('group');
        if (gettype($group) === 'string') { 
            $group = Group::where('subdomain', $group)->first();
        }
        $expire_date = Carbon::parse($group->expire_date);
        $today_date = Carbon::now();
        if ($today_date->isAfter($expire_date)) {
            return back()->with('warning', 'You need to pay to access admin pages.');
        }
        return $next($request);
    }
}
