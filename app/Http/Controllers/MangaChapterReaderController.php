<?php

namespace App\Http\Controllers;

use App\Models\Chapter;
use App\Models\Group;
use App\Models\Manga;

class MangaChapterReaderController extends Controller
{
    public function show(Group $group, Manga $manga, Chapter $chapter)
    {
        abort_unless(
            $chapter->group_id === $group->id
            && $chapter->chapterable_type === Manga::class
            && (int) $chapter->chapterable_id === (int) $manga->id,
            404
        );

        $chapter->load(['images' => fn ($q) => $q->orderBy('order')]);

        $mode = null;
        if ($chapter->pdf_path) {
            $mode = 'pdf';
        } elseif ($chapter->images->isNotEmpty()) {
            $mode = 'images';
        }

        $siblingQuery = Chapter::query()
            ->where('group_id', $group->id)
            ->where('chapterable_type', Manga::class)
            ->where('chapterable_id', $manga->id)
            ->where('season_id', $chapter->season_id)
            ->orderBy('chapter_number');

        $prev = (clone $siblingQuery)->where('chapter_number', '<', $chapter->chapter_number)->orderByDesc('chapter_number')->first();
        $next = (clone $siblingQuery)->where('chapter_number', '>', $chapter->chapter_number)->orderBy('chapter_number')->first();

        $chapterOptions = Chapter::query()
            ->where('group_id', $group->id)
            ->where('chapterable_type', Manga::class)
            ->where('chapterable_id', $manga->id)
            ->with('season:id,title,season_number')
            ->get(['id', 'chapter_number', 'title', 'season_id'])
            ->sortBy(fn (Chapter $c) => sprintf(
                '%06d-%012d',
                $c->season?->season_number ?? 999999,
                (int) $c->chapter_number
            ))
            ->values()
            ->map(fn (Chapter $c) => [
                'id' => $c->id,
                'label' => $c->season
                    ? sprintf('%s · Ch. %s — %s', $c->season->title, $c->chapter_number, $c->title)
                    : sprintf('Ch. %s — %s', $c->chapter_number, $c->title),
            ])
            ->all();

        return inertia('Group/MangaChapterReader', [
            'manga' => $manga->only(['id', 'name', 'slug', 'thumbnail']),
            'chapter' => $chapter->only(['id', 'title', 'chapter_number', 'pdf_path']),
            'images' => $chapter->images->pluck('path')->values()->all(),
            'readerMode' => $mode,
            'prevChapterId' => $prev?->id,
            'nextChapterId' => $next?->id,
            'chapterOptions' => $chapterOptions,
        ]);
    }
}
