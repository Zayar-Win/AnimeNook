<?php

namespace App\Services;

use App\Jobs\ProcessChapterZipJob;
use App\Models\Chapter;
use App\Models\ChapterZipImport;
use App\Models\Group;
use App\Models\UploadSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use RuntimeException;

class ChapterZipImportRegistrar
{
    public function __construct(private ChapterZipProcessingService $zipService) {}

    public function queueFromUploadSession(
        Group $group,
        Request $request,
        Chapter $chapter,
        string $uploadId,
    ): ChapterZipImport {
        /** @var UploadSession|null $session */
        $session = UploadSession::query()
            ->where('id', $uploadId)
            ->where('group_id', $group->id)
            ->where('user_id', $request->user()->id)
            ->where('target', 'chapter-zip')
            ->where('status', 'complete')
            ->first();

        if (! $session || ! $session->stored_path) {
            throw ValidationException::withMessages([
                'zip_upload_id' => 'Invalid or incomplete ZIP upload session.',
            ]);
        }

        $zipPath = $session->stored_path;

        if (! Storage::exists($zipPath)) {
            $session->delete();

            throw ValidationException::withMessages([
                'zip_upload_id' => 'ZIP file is no longer available. Upload again.',
            ]);
        }

        $tmpZip = tempnam(sys_get_temp_dir(), 'chzipval_');
        if ($tmpZip === false) {
            throw ValidationException::withMessages([
                'zip_upload_id' => 'Could not prepare ZIP for validation.',
            ]);
        }

        try {
            $stream = Storage::readStream($zipPath);
            if (! $stream) {
                throw new RuntimeException('Could not read ZIP from storage.');
            }
            try {
                $out = fopen($tmpZip, 'wb');
                if (! $out) {
                    throw new RuntimeException('Could not open temporary file.');
                }
                try {
                    stream_copy_to_stream($stream, $out);
                } finally {
                    fclose($out);
                }
            } finally {
                if (is_resource($stream)) {
                    fclose($stream);
                }
            }

            try {
                $this->zipService->assertZipReadable($tmpZip);
                $this->zipService->assertZipHasCandidateImages($tmpZip);
            } catch (RuntimeException $e) {
                throw ValidationException::withMessages([
                    'zip_upload_id' => $e->getMessage(),
                ]);
            }
        } finally {
            if (is_file($tmpZip)) {
                @unlink($tmpZip);
            }
        }

        $import = ChapterZipImport::create([
            'chapter_id' => $chapter->id,
            'group_id' => $group->id,
            'user_id' => $request->user()->id,
            'zip_storage_path' => $zipPath,
            'status' => 'pending',
        ]);

        $session->delete();

        ProcessChapterZipJob::dispatch($import->id);

        return $import;
    }
}
