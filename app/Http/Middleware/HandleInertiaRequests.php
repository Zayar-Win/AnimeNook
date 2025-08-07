<?php

namespace App\Http\Middleware;

use App\Models\Group;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tightenco\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'group' => function () use ($request) {
                $group = $request->route('group');
                if (gettype($group) === 'string') {
                    $group = Group::where('subdomain', $group)->first();
                }
                return $group;
            },
            'ziggy' => fn() => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'toastMessage' => fn() => [
                'success' => session()->get('success'),
                'warning' => session()->get('warning'),
                'error' => session()->get('error')
            ],
            'APP_URL' => env('APP_URL'),
            'env' => env('APP_ENV')
        ];
    }
}
