<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\Manga;

class MangaDetailController extends Controller
{
    public function index(Group $group, Manga $manga)
    {
        $manga = Manga::with(['chapters', 'chapters' => function ($query) {
            return $query->withCount('comments');
        }, 'comments' => function ($query) {
            $query->orderBy('created_at', 'desc');
        }])->where('id', $manga->id)->withCount('ratings')->first();
        $manga->append('isLikeByCurrentUser');
        $recommendedMangas = Manga::with(['chapters', 'comments', 'tags' => function ($query) use ($manga) {
            return $query->whereIn('tags.id', $manga->tags->pluck('id')->toArray());
        }])->withCount('chapters', 'comments', 'ratings')->where('id', '!=', $manga->id)->paginate(4);
        return inertia('Group/MangaDetail', [
            'manga' => $manga,
            'recommendedMangas' => $recommendedMangas
        ]);
    }
}
