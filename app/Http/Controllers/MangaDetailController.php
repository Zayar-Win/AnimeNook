<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\Manga;

class MangaDetailController extends Controller
{
    public function index(Group $group, Manga $manga)
    {
        $seasonNumber = request()->get('season') ?? 1;
        $manga = Manga::with(['chapters', 'chapters' => function($query) use($seasonNumber) {
            $query->with('season')->whereHas('season',function($query) use($seasonNumber) {
                $query->where('season_number',$seasonNumber);
            })->withCount('comments');
        }, 'comments' => function ($query) {
            $query->with(['comments' => function ($query) {
                $query->withCount('likes');
            }])->whereNull('comment_id')->withCount('likes')->orderBy('created_at', 'desc');
        }])->where('id', $manga->id)->withCount('ratings')->first();
        $manga->append('isLikeByCurrentUser');
        $recommendedMangas = Manga::with(['chapters', 'comments', 'tags' => function ($query) use ($manga) {
            return $query->whereIn('tags.id', $manga->tags->pluck('id')->toArray());
        }])->withCount('chapters', 'comments', 'ratings')->where('id', '!=', $manga->id)->paginate(4);
        $seasons = $manga->seasons()->withCount('chapters')->get();
        return inertia('Group/MangaDetail', [
            'manga' => $manga,
            'recommendedMangas' => $recommendedMangas,
            'seasons' => $seasons,
        ]);
    }
}
