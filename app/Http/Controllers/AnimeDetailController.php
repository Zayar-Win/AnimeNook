<?php

namespace App\Http\Controllers;

use App\Models\Anime;
use App\Models\Group;

class AnimeDetailController extends Controller
{
    public function index(Group $group, Anime $anime)
    {
        $anime = Anime::with(['chapters', 'comments' => function ($query) {
            $query->orderBy('created_at', 'desc');
        },  'comments.user'])->where('id', $anime->id)->withCount('ratings')->first();
        return inertia('Group/VideoDetail', [
            'anime' => $anime
        ]);
    }
}
