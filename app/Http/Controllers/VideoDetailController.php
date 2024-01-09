<?php

namespace App\Http\Controllers;

use App\Models\Anime;
use App\Models\Group;

class VideoDetailController extends Controller
{
    public function index(Group $group, Anime $anime)
    {
        $anime = Anime::with(['chapters', 'chapters' => function ($query) {
            return $query->withCount('comments');
        }])->where('id', $anime->id)->withCount('ratings')->first();
        return inertia('Group/VideoDetailPage', [
            'anime' => $anime
        ]);
    }
}
