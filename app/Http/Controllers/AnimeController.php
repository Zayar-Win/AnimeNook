<?php

namespace App\Http\Controllers;

use App\Models\Anime;
use App\Models\Group;
use App\Models\Manga;
use App\Models\Rating;
use App\Models\Status;
use Inertia\Inertia;

class AnimeController extends Controller
{
    public function index(Group $group)
    {
        $filters = [
            'search' => request()->get('search', ''),
            'sort' => request()->get('sort', 'newest'),
            'tags' => request()->get('tags'),
            'status' => request()->get('status'),
            'isApi' => request()->get('isApi'),
        ];

        $sort = $filters['sort'] ?: 'newest';

        $mangasQuery = Manga::with('tags')
            ->where('group_id', $group->id)
            ->when($filters['search'] !== null && $filters['search'] !== '', function ($query) use ($filters) {
                $s = $filters['search'];
                $query->where(function ($q) use ($s) {
                    $q->where('name', 'LIKE', '%' . $s . '%')
                        ->orWhere('description', 'LIKE', '%' . $s . '%');
                });
            })
            ->when($filters['tags'] ?? null, function ($query, $tags) {
                $tagNames = explode(',', $tags);
                $query->whereHas('tags', function ($q) use ($tagNames) {
                    $q->whereIn('name', $tagNames);
                });
            })
            ->when(
                ! empty($filters['status']) && $filters['status'] !== 'all',
                function ($query) use ($filters) {
                    $query->whereHas('status', function ($q) use ($filters) {
                        $q->where('keyword', $filters['status']);
                    });
                }
            );

        if ($sort === 'most_chapters') {
            $mangasQuery->withCount('chapters');
        }

        match ($sort) {
            'popularity' => $mangasQuery->orderBy('views_count', 'desc'),
            'alphabetical' => $mangasQuery->orderBy('name', 'asc'),
            'most_liked' => $mangasQuery->orderBy('likes_count', 'desc'),
            'top_rated' => $mangasQuery->orderBy('rating', 'desc'),
            'most_chapters' => $mangasQuery->orderByDesc('chapters_count'),
            default => $mangasQuery->orderBy('created_at', 'desc'),
        };

        $mangas = $mangasQuery->paginate(12, ['*'], 'page');

        $data = $mangas->items();
        $paginateData = [
            'manga' => [
                'currentPage' => $mangas->currentPage(),
                'lastPage' => $mangas->lastPage(),
            ],
        ];

        if (! $filters['isApi']) {
            return Inertia::render('Group/Animes', [
                'data' => $data,
                'paginateData' => $paginateData,
                'filters' => $filters,
                'tags' => $group->tags()->get(),
                'statuses' => Status::orderBy('name')->get(['id', 'name', 'keyword']),
            ]);
        }

        return response()->json([
            'data' => $data,
            'paginateData' => $paginateData,
        ]);
    }

    public function likeOrUnlike(Group $group, Anime $anime)
    {
        $likeStatus = $anime->likeUsers()->toggle(auth()->id());
        if ($likeStatus['attached']) {
            $anime->update([
                'likes_count' => $anime->likes_count + 1
            ]);
        } else {
            $anime->update([
                'likes_count' => $anime->likes_count - 1
            ]);
        }
        return back();
    }

    public function rating(Group $group, Anime $anime)
    {
        $totalRating = $anime->ratings()->sum('rating');
        $rating = $anime->ratings()->where('user_id', auth()->id())->first();
        if ($rating) {
            $anime->update([
                'rating' => number_format(($totalRating - $rating->rating + request('rating'))   / $anime->ratings()->count(), 1)
            ]);
            $rating->update([
                'rating' => request('rating')
            ]);
            return back()->with('success', 'Updated your rating.');
        } else {
            Rating::create([
                'user_id' => auth()->id(),
                'group_id' => $group->id,
                'rating' => request('rating'),
                'ratingable_id' => $anime->id,
                'ratingable_type' => Anime::class
            ]);
            $anime->update([
                'rating' => number_format(($totalRating + request('rating')) / $anime->ratings()->count(), 1)
            ]);
            return back()->with('success', 'Thank for your rating.');
        }
    }
}
