<?php

namespace App\Providers;

use App\Models\Group;
use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        ResetPassword::createUrlUsing(function (User $user, string $token) {
            $group = Group::query()->find($user->group_id);
            if (! $group) {
                return route('password.reset', [
                    'token' => $token,
                ], true).'?email='.urlencode($user->email);
            }

            return route('group.password.reset', [
                'group' => $group->subdomain,
                'token' => $token,
            ], true).'?email='.urlencode($user->email);
        });
    }
}
