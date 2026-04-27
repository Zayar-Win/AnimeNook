<?php

namespace App\Http\Controllers;

use App\Models\Chapter;
use App\Models\Group;
use App\Models\Manga;
use App\Models\User;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Group $group)
    {
        $today = Carbon::today();
        $monthStart = $today->copy()->startOfMonth();
        $monthEnd = $today->copy()->endOfMonth();
        $defaultRangeStart = $today->copy()->subDays(29)->startOfDay();
        $defaultRangeEnd = $today->copy()->endOfDay();

        $requestedStartDate = request()->string('start_date')->toString();
        $requestedEndDate = request()->string('end_date')->toString();

        $rangeStart = $defaultRangeStart->copy();
        $rangeEnd = $defaultRangeEnd->copy();
        $selectedStartDate = null;
        $selectedEndDate = null;
        $selectedRangeLabel = 'Last 30 days';

        if ($requestedStartDate !== '' && $requestedEndDate !== '') {
            try {
                $customStart = Carbon::parse($requestedStartDate)->startOfDay();
                $customEnd = Carbon::parse($requestedEndDate)->endOfDay();

                if ($customStart->lessThanOrEqualTo($customEnd)) {
                    $rangeStart = $customStart;
                    $rangeEnd = $customEnd;
                    $selectedStartDate = $customStart->toDateString();
                    $selectedEndDate = $customEnd->toDateString();
                    $selectedRangeLabel = $customStart->format('M d, Y').' - '.$customEnd->format('M d, Y');
                }
            } catch (\Throwable $e) {
                // Fallback to default range when date parsing fails.
            }
        }

        $usersTotal = User::query()
            ->where('group_id', $group->id)
            ->count();
        $mangasTotal = Manga::query()
            ->where('group_id', $group->id)
            ->count();
        $chaptersTotal = Chapter::query()
            ->where('group_id', $group->id)
            ->where('chapterable_type', Manga::class)
            ->count();

        $newUsersThisMonth = User::query()
            ->where('group_id', $group->id)
            ->whereBetween('created_at', [$monthStart, $monthEnd])
            ->count();
        $newMangasThisMonth = Manga::query()
            ->where('group_id', $group->id)
            ->whereBetween('created_at', [$monthStart, $monthEnd])
            ->count();
        $newUsersToday = User::query()
            ->where('group_id', $group->id)
            ->whereDate('created_at', $today)
            ->count();

        $usersByDay = User::query()
            ->selectRaw('DATE(created_at) as day, COUNT(*) as total')
            ->where('group_id', $group->id)
            ->whereBetween('created_at', [$rangeStart, $rangeEnd])
            ->groupBy('day')
            ->pluck('total', 'day');

        $mangasByDay = Manga::query()
            ->selectRaw('DATE(created_at) as day, COUNT(*) as total')
            ->where('group_id', $group->id)
            ->whereBetween('created_at', [$rangeStart, $rangeEnd])
            ->groupBy('day')
            ->pluck('total', 'day');

        $viewsByDay = DB::table('views')
            ->join('mangas', function ($join) use ($group) {
                $join->on('mangas.id', '=', 'views.viewable_id')
                    ->where('views.viewable_type', Manga::class)
                    ->where('mangas.group_id', $group->id);
            })
            ->selectRaw('DATE(views.created_at) as day, COUNT(*) as total')
            ->whereBetween('views.created_at', [$rangeStart, $rangeEnd])
            ->groupBy('day')
            ->pluck('total', 'day');

        $likesByDay = DB::table('likeables')
            ->join('mangas', function ($join) use ($group) {
                $join->on('mangas.id', '=', 'likeables.likeable_id')
                    ->where('likeables.likeable_type', Manga::class)
                    ->where('mangas.group_id', $group->id);
            })
            ->selectRaw('DATE(likeables.created_at) as day, COUNT(*) as total')
            ->whereBetween('likeables.created_at', [$rangeStart, $rangeEnd])
            ->groupBy('day')
            ->pluck('total', 'day');

        $trendUsersAndManga = collect(CarbonPeriod::create($rangeStart->copy()->startOfDay(), $rangeEnd->copy()->startOfDay()))
            ->map(function (Carbon $date) use ($usersByDay, $mangasByDay) {
                $day = $date->toDateString();

                return [
                    'date' => $day,
                    'label' => $date->format('M d'),
                    'users' => (int) ($usersByDay[$day] ?? 0),
                    'mangas' => (int) ($mangasByDay[$day] ?? 0),
                ];
            })
            ->values();

        $trendViewsAndLikes = collect(CarbonPeriod::create($rangeStart->copy()->startOfDay(), $rangeEnd->copy()->startOfDay()))
            ->map(function (Carbon $date) use ($viewsByDay, $likesByDay) {
                $day = $date->toDateString();

                return [
                    'date' => $day,
                    'label' => $date->format('M d'),
                    'views' => (int) ($viewsByDay[$day] ?? 0),
                    'likes' => (int) ($likesByDay[$day] ?? 0),
                ];
            })
            ->values();

        $topRangeStart = $today->copy()->subDays(29)->startOfDay();
        $topRangeEnd = $today->copy()->endOfDay();

        $topViewedMangas = Manga::query()
            ->where('group_id', $group->id)
            ->leftJoin('views', function ($join) use ($topRangeStart, $topRangeEnd) {
                $join->on('views.viewable_id', '=', 'mangas.id')
                    ->where('views.viewable_type', Manga::class)
                    ->whereBetween('views.created_at', [$topRangeStart, $topRangeEnd]);
            })
            ->select([
                'mangas.id',
                'mangas.name',
                'mangas.slug',
                'mangas.thumbnail',
                'mangas.views_count',
                'mangas.likes_count',
                'mangas.created_at',
                'mangas.updated_at',
                DB::raw('COUNT(views.id) as views_last_30_days'),
            ])
            ->withCount('chapters')
            ->groupBy(
                'mangas.id',
                'mangas.name',
                'mangas.slug',
                'mangas.thumbnail',
                'mangas.views_count',
                'mangas.likes_count',
                'mangas.created_at',
                'mangas.updated_at'
            )
            ->havingRaw('COUNT(views.id) > 0')
            ->orderByDesc('views_last_30_days')
            ->orderByDesc('mangas.views_count')
            ->take(6)
            ->get();

        return inertia('Group/Admin/Dashboard', [
            'kpis' => [
                'users_total' => $usersTotal,
                'mangas_total' => $mangasTotal,
                'chapters_total' => $chaptersTotal,
                'new_users_this_month' => $newUsersThisMonth,
                'new_users_today' => $newUsersToday,
                'new_mangas_this_month' => $newMangasThisMonth,
            ],
            'trendUsersAndManga' => $trendUsersAndManga,
            'trendViewsAndLikes' => $trendViewsAndLikes,
            'topViewedMangas' => $topViewedMangas,
            'selectedStartDate' => $selectedStartDate,
            'selectedEndDate' => $selectedEndDate,
            'selectedRangeLabel' => $selectedRangeLabel,
        ]);
    }
}
