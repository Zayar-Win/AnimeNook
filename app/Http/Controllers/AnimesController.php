<?php

namespace App\Http\Controllers;

use App\Models\Anime;
use App\Models\Group;
use App\Models\Manga;
use Illuminate\Http\Request;

class AnimesController extends Controller
{
    public function index(Group $group)
    {
        $filters = [
            'search' => request()->get('search'),
            'sort' => request()->get('sort'),
            'filter' => request()->get('filter'),
        ];
        $animes = Anime::with('tags')->where('group_id', $group->id)->where(function ($query) use ($filters) {
            $query->where('name', 'LIKE', '%' . $filters['search'] . '%')
                ->orWhere('description', 'LIKE', '%' . $filters['search'] . '%');
        })->when($filters['sort'] === 'newest', function ($query) {
            $query->orderBy('created_at', 'desc');
        })
            ->when($filters['sort'] === 'popularity', function ($query) {
                $query->orderBy('views_count', 'desc');
            })->get();
        $mangas = Manga::with('tags')->where('group_id', $group->id)->where(function ($query) use ($filters) {
            $query->where('name', 'LIKE', '%' . $filters['search'] . '%')
                ->orWhere('description', 'LIKE', '%' . $filters['search'] . '%');
        })->get();

        return inertia('Group/Animes', [
            'data' => [
                'animes' => $filters['filter'] === 'animes' || $filters['filter'] === null ? $animes : [],
                'mangas' => $filters['filter'] === 'mangas' || $filters['filter'] === null ? $mangas : []
            ],
            'filters' => $filters
        ]);
    }
}
