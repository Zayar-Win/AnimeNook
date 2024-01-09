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
        $recommendedAnimes = Anime::with(['chapters', 'comments', 'tags' => function ($query) use ($anime) {
            return $query->whereIn('tags.id', $anime->tags->pluck('id')->toArray());
        }])->withCount('chapters', 'comments', 'ratings')->where('id', '!=', $anime->id)->paginate(4);
        return inertia('Group/VideoDetailPage', [
            'anime' => $anime,
            'recommendedAnimes' => $recommendedAnimes
        ]);
    }
}
