<?php

namespace App\Http\Controllers;

use App\Http\Requests\CommentRequest;
use App\Models\Anime;
use App\Models\Comment;
use App\Models\Group;
use App\Models\Manga;

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
    public function likeOrUnlike(Group $group, Comment $comment)
    {
        $likeStatus = $comment->likeUsers()->toggle(auth()->id());
        if ($likeStatus['attached']) {
            $comment->update([
                'likes_count' => $comment->likes_count + 1
            ]);
        } else {
            $comment->update([
                'likes_count' => $comment->likes_count - 1
            ]);
        }
        return back();
    }
}
