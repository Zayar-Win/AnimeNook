<?php

namespace App\Http\Controllers;

use App\Models\Anime;
use App\Models\Group;
use App\Models\Manga;
use App\Models\Rating;
use Inertia\Inertia;

class AnimeController extends Controller
{
    public function index(Group $group)
    {
        $filters = [
            'search' => request()->get('search'),
            'sort' => request()->get('sort'),
            'filter' => request()->get('filter'),
            'tags' => request()->get('tags'),
            'isApi' => request()->get('isApi')
        ];


        $animes = Anime::with('tags')->where('group_id', $group->id)->where(function ($query) use ($filters) {
            $query->where('name', 'LIKE', '%' . $filters['search'] . '%')
                ->orWhere('description', 'LIKE', '%' . $filters['search'] . '%');
        })->when($filters['sort'] === 'newest', function ($query) {
            $query->orderBy('created_at', 'desc');
        })
            ->when($filters['tags'] ?? null, function ($query, $tags) {
                $tags = explode(',', $tags);
                $query->whereHas('tags', function ($query) use ($tags) {
                    $query->whereIn('name', $tags);
                });
            })
            ->when($filters['sort'] === 'popularity', function ($query) {
                $query->orderBy('views_count', 'desc');
            })->paginate(12, ['*'], 'animepage');
        $mangas = Manga::with('tags')->where('group_id', $group->id)->where(function ($query) use ($filters) {
            $query->where('name', 'LIKE', '%' . $filters['search'] . '%')
                ->orWhere('description', 'LIKE', '%' . $filters['search'] . '%');
        })->when($filters['sort'] === 'newest', function ($query) {
            $query->orderBy('created_at', 'desc');
        })
            ->when($filters['tags'] ?? null, function ($query, $tags) {
                $tags = explode(',', $tags);
                $query->whereHas('tags', function ($query) use ($tags) {
                    $query->whereIn('name', $tags);
                });
            })
            ->when($filters['sort'] === 'popularity', function ($query) {
                $query->orderBy('views_count', 'desc');
            })->paginate(12, ['*'], 'mangapage');

        $data = collect($animes->items())->concat($mangas->items())->shuffle();
        if ($filters['filter'] === 'animes') {
            $data = $animes->items();
        }
        if ($filters['filter'] === 'mangas') {
            $data = $mangas->items();
        }
        $paginateData = [
            'anime' => [
                'currentPage' => $animes->currentPage(),
                'lastPage' => $animes->lastPage()
            ],
            'manga' => [
                'currentPage' => $mangas->currentPage(),
                'lastPage' => $animes->lastPage()
            ]
        ];
        if (!$filters['isApi']) {
            return Inertia::render('Group/Animes', [
                'data' => $data,
                'paginateData' => $paginateData,
                'filters' => $filters,
                'tags' => $group->tags()->get()
            ]);
        } else {
            return response()->json([
                'data' => $data,
                'paginateData' => $paginateData,
            ]);
        }
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
