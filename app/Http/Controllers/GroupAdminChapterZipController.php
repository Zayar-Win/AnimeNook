<?php

namespace App\Http\Controllers;

use App\Models\Chapter;
use App\Models\ChapterZipImport;
use App\Models\Group;
use App\Models\Manga;
use App\Services\ChapterZipImportRegistrar;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class GroupAdminChapterZipController extends Controller
{
    public function store(
        Group $group,
        Manga $manga,
        Chapter $chapter,
        Request $request,
        ChapterZipImportRegistrar $zipRegistrar,
    ) {
        $this->authorizeChapter($group, $manga, $chapter);

        $validated = $request->validate([
            'upload_id' => ['required', 'uuid'],
        ]);

        $import = $zipRegistrar->queueFromUploadSession(
            $group,
            $request,
            $chapter,
            $validated['upload_id'],
        );

        return response()->json([
            'status' => 'processing',
            'import_id' => $import->id,
            'message' => 'ZIP import has been queued for processing.',
        ], Response::HTTP_ACCEPTED);
    }

    public function show(
        Group $group,
        Manga $manga,
        Chapter $chapter,
        ChapterZipImport $import,
    ) {
        $this->authorizeChapter($group, $manga, $chapter);

        if ((int) $import->chapter_id !== (int) $chapter->id) {
            abort(Response::HTTP_NOT_FOUND);
        }

        if ((int) $import->group_id !== (int) $group->id) {
            abort(Response::HTTP_NOT_FOUND);
        }

        return response()->json([
            'import_id' => $import->id,
            'status' => $import->status,
            'pages_imported' => $import->pages_imported,
            'error_message' => $import->error_message,
            'updated_at' => $import->updated_at?->toIso8601String(),
        ]);
    }

    private function authorizeChapter(Group $group, Manga $manga, Chapter $chapter): void
    {
        abort_unless(
            (int) $chapter->group_id === (int) $group->id
            && $chapter->chapterable_type === Manga::class
            && (int) $chapter->chapterable_id === (int) $manga->id
            && (int) $manga->group_id === (int) $group->id,
            404
        );
    }
}
