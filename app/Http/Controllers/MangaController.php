<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\Likeable;
use App\Models\Manga;
use App\Models\Rating;
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
    public function rating(Group $group, Manga $manga)
    {
        $totalRating = $manga->ratings()->sum('rating');
        $rating = $manga->ratings()->where('user_id', auth()->id())->first();
        if ($rating) {
            $manga->update([
                'rating' => number_format(($totalRating - $rating->rating + request('rating'))   / $manga->ratings()->count(), 1)
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
                'ratingable_id' => $manga->id,
                'ratingable_type' => Manga::class
            ]);
            $manga->update([
                'rating' => number_format(($totalRating + request('rating')) / $manga->ratings()->count(), 1)
            ]);
            return back()->with('success', 'Thank for your rating.');
        }
    }
}
