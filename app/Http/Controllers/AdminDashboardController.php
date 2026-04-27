<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\User;
use Carbon\Carbon;
use Carbon\CarbonPeriod;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today();
        $monthStart = $today->copy()->startOfMonth();
        $monthEnd = $today->copy()->endOfMonth();
        $lastMonthStart = $monthStart->copy()->subMonth()->startOfMonth();
        $lastMonthEnd = $monthStart->copy()->subMonth()->endOfMonth();

        $rangeStart = $today->copy()->subDays(29)->startOfDay();
        $rangeEnd = $today->copy()->endOfDay();

        $usersTotal = User::query()->count();
        $groupsTotal = Group::query()->count();

        $newUsersThisMonth = User::query()
            ->whereBetween('created_at', [$monthStart, $monthEnd])
            ->count();
        $newGroupsThisMonth = Group::query()
            ->whereBetween('created_at', [$monthStart, $monthEnd])
            ->count();

        $newUsersLastMonth = User::query()
            ->whereBetween('created_at', [$lastMonthStart, $lastMonthEnd])
            ->count();
        $newGroupsLastMonth = Group::query()
            ->whereBetween('created_at', [$lastMonthStart, $lastMonthEnd])
            ->count();

        $newUsersToday = User::query()
            ->whereDate('created_at', $today)
            ->count();
        $newGroupsToday = Group::query()
            ->whereDate('created_at', $today)
            ->count();

        $usersByDay = User::query()
            ->selectRaw('DATE(created_at) as day, COUNT(*) as total')
            ->whereBetween('created_at', [$rangeStart, $rangeEnd])
            ->groupBy('day')
            ->pluck('total', 'day');

        $groupsByDay = Group::query()
            ->selectRaw('DATE(created_at) as day, COUNT(*) as total')
            ->whereBetween('created_at', [$rangeStart, $rangeEnd])
            ->groupBy('day')
            ->pluck('total', 'day');

        $trend = collect(CarbonPeriod::create($rangeStart->copy()->startOfDay(), $rangeEnd->copy()->startOfDay()))
            ->map(function (Carbon $date) use ($usersByDay, $groupsByDay) {
                $day = $date->toDateString();

                return [
                    'date' => $day,
                    'label' => $date->format('M d'),
                    'users' => (int) ($usersByDay[$day] ?? 0),
                    'groups' => (int) ($groupsByDay[$day] ?? 0),
                ];
            })
            ->values();

        $latestUsers = User::query()
            ->latest()
            ->take(8)
            ->get(['id', 'name', 'email', 'type', 'role_id', 'created_at']);

        $latestGroups = Group::query()
            ->latest()
            ->take(8)
            ->get(['id', 'name', 'subdomain', 'plan_id', 'expire_date', 'created_at']);

        return inertia('Admin/Dashboard', [
            'kpis' => [
                'users_total' => $usersTotal,
                'groups_total' => $groupsTotal,
                'new_users_this_month' => $newUsersThisMonth,
                'new_groups_this_month' => $newGroupsThisMonth,
                'new_users_today' => $newUsersToday,
                'new_groups_today' => $newGroupsToday,
                'new_users_last_month' => $newUsersLastMonth,
                'new_groups_last_month' => $newGroupsLastMonth,
            ],
            'trend' => $trend,
            'latestUsers' => $latestUsers,
            'latestGroups' => $latestGroups,
        ]);
    }
}
