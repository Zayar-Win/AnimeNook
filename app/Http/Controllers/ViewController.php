<?php

namespace App\Http\Controllers;

use App\Models\Anime;
use App\Models\Group;
use App\Models\Manga;
use App\Models\View;
use Ramsey\Uuid\Uuid;

class ViewController extends Controller
{
    public function store(Group $group)
    {
        $validatedData = request()->validate(
            [
                'viewable_id'  => 'required',
                'viewable_type' => 'required|in:anime,manga',
            ]
        );

        if ($validatedData['viewable_type'] === 'anime') {
            $validatedData['viewable_type'] = Anime::class;
            $anime = Anime::whereId($validatedData['viewable_id'])->first();
            if (!$anime->isViewedByCurrentUser()) {
                $anime->update(['views_count' => $anime->views_count + 1]);
            } else {
                return response()->status(200);
            }
        } else {
            $validatedData['viewable_type'] = Manga::class;
            $manga = Manga::whereId($validatedData['viewable_id'])->first();
            if (!$manga->isViewedByCurrentUser()) {
                $manga->update(['views_count' => $manga->views_count + 1]);
            } else {
                return response()->status(200);
            }
        }
        if (auth()->check()) {
            View::create([
                'user_id' => auth()->id(),
                ...$validatedData
            ]);
        } else {
            $anonymous_identifier = session()->get('anonymous_identifier');
            if (!$anonymous_identifier) {
                $anonymous_identifier = Uuid::uuid4()->toString();
                session()->put('anonymous_identifier', $anonymous_identifier);
            }
            View::create([
                'anonymous_identifier' => $anonymous_identifier,
                ...$validatedData
            ]);
        }
        return response()->json();
    }
}
