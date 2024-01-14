<?php

namespace App\Http\Controllers;

use App\Http\Requests\CommentRequest;
use App\Models\Anime;
use App\Models\Comment;
use App\Models\Group;
use App\Models\Manga;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Group $group, CommentRequest $request)
    {
        $validatedData = $request->validated();
        $comment = Comment::create([
            'user_id' => auth()->id(),
            'group_id' => $group->id,
            'body' => $validatedData['comment'],
            'commentable_id' => $validatedData['animeId'] ?? $validatedData['mangaId'],
            'commentable_type' => $validatedData['animeId'] ?? null !== null ? Anime::class : Manga::class,
        ]);

        return back()->with('success', 'Comment Created successful.');
    }
}
