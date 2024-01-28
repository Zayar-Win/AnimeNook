<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\Likeable;
use App\Models\Manga;
use Illuminate\Http\Request;

class MangaController extends Controller
{
    public function like(Group $group, Manga $manga)
    {

        if ($manga->isLikeByUser()) {
            auth()->user()->likes()->where(['likeable_id' => $manga->id, 'likeable_type' => Manga::class])->delete();
            $manga->update([
                'likes_count' => $manga->likes_count - 1
            ]);
        } else {
            auth()->user()->likes()->create(['likeable_id' => $manga->id, 'likeable_type' => Manga::class]);
            $manga->update([
                'likes_count' => $manga->likes_count + 1
            ]);
        }
        return back();
    }
}
