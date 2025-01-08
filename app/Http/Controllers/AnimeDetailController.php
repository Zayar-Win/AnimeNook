<?php

namespace App\Http\Controllers;

use App\Models\Anime;
use App\Models\Chapter;
use App\Models\Group;

class AnimeDetailController extends Controller
{
    public function index(Group $group, Anime $anime)
    {
        $seasonNumber = request()->get('season') ?? 1;

        $anime = Anime::with(['chapters' => function($query) use($seasonNumber) {
            $query->with('season')->whereHas('season',function($query) use($seasonNumber) {
                $query->where('season_number',$seasonNumber);
            });
        },'comments' => function ($query) {
            $query->with(['comments' => function ($query) {
                $query->withCount('likes');
            }])->whereNull('comment_id')->withCount('likes')->orderBy('created_at', 'desc');
        },  'comments.user', 'comments.likes'])->where('id', $anime->id)->withCount('ratings', 'comments')->first();
        $seasons = $anime->seasons()->withCount('chapters')->get();
        $anime->append('isLikeByCurrentUser');
        return inertia('Group/VideoDetail', [
            'anime' => $anime,
            'seasons' => $seasons
        ]);
    }
}
