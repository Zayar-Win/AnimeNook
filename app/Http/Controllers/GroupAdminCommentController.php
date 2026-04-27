<?php

namespace App\Http\Controllers;

use App\Models\Anime;
use App\Models\Comment;
use App\Models\Group;
use App\Models\Manga;
use Illuminate\Http\Request;

class GroupAdminCommentController extends Controller
{
    public function index(Group $group, Request $request)
    {
        $data = [
            'search' => trim((string) $request->input('search', '')),
            'type' => $request->input('type'),
            'period' => $request->input('period'),
        ];

        $filters = validator($data, [
            'search' => ['nullable', 'string', 'max:255'],
            'type' => ['nullable', 'in:anime,manga'],
            'period' => ['nullable', 'in:7d,30d,90d'],
        ])->validated();

        $query = $group->comments()->with('commentable');

        if (($filters['search'] ?? '') !== '') {
            $like = '%'.$filters['search'].'%';
            $query->where(function ($q) use ($like) {
                $q->where('body', 'like', $like)
                    ->orWhereHasMorph('commentable', [Anime::class, Manga::class], function ($sub) use ($like) {
                        $sub->where('name', 'like', $like);
                    });
            });
        }

        if (($filters['type'] ?? '') === 'anime') {
            $query->where('commentable_type', Anime::class);
        } elseif (($filters['type'] ?? '') === 'manga') {
            $query->where('commentable_type', Manga::class);
        }

        if (! empty($filters['period'])) {
            $days = match ($filters['period']) {
                '7d' => 7,
                '30d' => 30,
                '90d' => 90,
                default => null,
            };
            if ($days !== null) {
                $query->where('created_at', '>=', now()->subDays($days));
            }
        }

        $comments = $query->latest()->paginate(15)->withQueryString();

        return inertia('Group/Admin/Comments/Index', [
            'comments' => $comments,
            'filters' => [
                'search' => $filters['search'] ?? '',
                'type' => $filters['type'] ?? null,
                'period' => $filters['period'] ?? null,
            ],
        ]);
    }
    public function delete(Group $group, Comment $comment)
    {
        $comment->delete();
        return back()->with('success', 'Comment deleted successful.');
    }

    public function bulkDelete(Group $group, Request $request)
    {
        $validated = $request->validate([
            'comment_ids' => ['required', 'array', 'min:1'],
            'comment_ids.*' => ['integer'],
        ]);

        Comment::query()
            ->where('group_id', $group->id)
            ->whereIn('id', $validated['comment_ids'])
            ->delete();

        return back()->with('success', 'Selected comments deleted successfully.');
    }
}
