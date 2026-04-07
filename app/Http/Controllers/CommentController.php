<?php

namespace App\Http\Controllers;

use App\Http\Requests\CommentRequest;
use App\Models\Anime;
use App\Models\Comment;
use App\Models\Group;
use App\Models\Manga;
use App\Models\User;
use App\Notifications\AdminNewCommentNotification;
use App\Notifications\CommentMentionNotification;
use App\Notifications\CommentReplyNotification;
use App\Support\CommentMentionLinker;
use Illuminate\Support\Facades\Notification;

class CommentController extends Controller
{
    private function resolvedMentionIds(array $validatedData, Group $group): \Illuminate\Support\Collection
    {
        $plain = html_entity_decode(strip_tags($validatedData['comment']), ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $plain = preg_replace('/\s+/u', ' ', $plain) ?? $plain;
        $fromBody = CommentMentionLinker::mentionedUserIdsFromPlainText($plain, $group, (int) auth()->id());

        return collect($validatedData['mentioned_user_ids'] ?? [])
            ->map(fn ($id) => (int) $id)
            ->merge($fromBody)
            ->unique()
            ->filter(fn (int $id) => $id > 0 && $id !== (int) auth()->id())
            ->values();
    }

    public function store(Group $group, CommentRequest $request)
    {
        $validatedData = $request->validated();
        $animeId = $validatedData['animeId'] ?? null;
        $mangaId = $validatedData['mangaId'] ?? null;
        $commentableId = $animeId ?? $mangaId;
        $commentableType = $animeId !== null ? Anime::class : Manga::class;

        $mentionIds = $this->resolvedMentionIds($validatedData, $group);

        $comment = Comment::create([
            'user_id' => auth()->id(),
            'group_id' => $group->id,
            'body' => $validatedData['comment'],
            'comment_id' => $validatedData['commentId'] ?? null,
            'commentable_id' => $commentableId,
            'commentable_type' => $commentableType,
            'mentioned_user_ids' => $mentionIds->all(),
        ]);

        $comment->load('user');

        if (! empty($validatedData['commentId'])) {
            $parent = Comment::where('id', $validatedData['commentId'])->first();
            if ($parent && (int) $parent->user_id !== (int) auth()->id()) {
                Notification::send(
                    User::whereKey($parent->user_id)->get(),
                    new CommentReplyNotification($comment, $group)
                );
            }
        }

        if ($mentionIds->isNotEmpty()) {
            $mentionUsers = User::where('group_id', $group->id)
                ->whereIn('id', $mentionIds)
                ->get();
            Notification::send(
                $mentionUsers,
                new CommentMentionNotification($comment, $group)
            );
        }

        $adminRecipients = User::adminsInGroup($group->id)
            ->where('id', '!=', auth()->id())
            ->get();
        if ($adminRecipients->isNotEmpty()) {
            Notification::send(
                $adminRecipients,
                new AdminNewCommentNotification($comment, $group)
            );
        }

        return back()->with('success', 'Comment Created successful.');
    }

    public function update(Group $group, CommentRequest $request)
    {
        $validatedData = $request->validated();
        $comment = Comment::where('id', $validatedData['commentId'])->first();
        if (! $comment || (int) $comment->user_id !== (int) auth()->id()) {
            return back()->with('warn', 'You can\'t update this comment.');
        }

        $mentionIds = $this->resolvedMentionIds($validatedData, $group);
        $comment->update([
            'body' => $validatedData['comment'],
            'mentioned_user_ids' => $mentionIds->all(),
        ]);

        return back()->with('success', 'Comment Updated successful.');
    }

    public function likeOrUnlike(Group $group, Comment $comment)
    {
        $likeStatus = $comment->likeUsers()->toggle(auth()->id());
        if ($likeStatus['attached']) {
            $comment->update([
                'likes_count' => $comment->likes_count + 1,
            ]);
        } else {
            $comment->update([
                'likes_count' => $comment->likes_count - 1,
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
