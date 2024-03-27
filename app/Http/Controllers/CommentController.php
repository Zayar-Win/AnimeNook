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
            'comment_id' => $validatedData['commentId'] ?? null,
            'commentable_id' => $validatedData['animeId'] ?? $validatedData['mangaId'],
            'commentable_type' => $validatedData['animeId'] ?? null !== null ? Anime::class : Manga::class,
        ]);

        return back()->with('success', 'Comment Created successful.');
    }
    public function update(Group $group, CommentRequest $request)
    {
        $validatedData = $request->validated();
        Comment::where('id', $validatedData['commentId'])->update([
            'body' => $validatedData['comment']
        ]);

        return back()->with('success', 'Comment Updated successful.');
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

    public function deleteComment(Group $group, Comment $comment)
    {
        if ($comment->user_id !== auth()->id()) {
            return back()->with('warn', 'You can\'t delete other user\'s comment.');
        }
        $comment->delete();
        return back()->with('success', 'Deleted comment.');
    }
}
