<?php

namespace App\Jobs;

use App\Models\ChapterZipImport;
use App\Services\ChapterZipProcessingService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use RuntimeException;
use Throwable;

class ProcessChapterZipJob implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    public function __construct(public string $chapterZipImportId) {}

    public function handle(ChapterZipProcessingService $service): void
    {
        /** @var ChapterZipImport|null $import */
        $import = ChapterZipImport::query()->find($this->chapterZipImportId);

        if (! $import) {
            return;
        }

        $import->update(['status' => 'processing']);

        $localZip = null;
        $zipPath = $import->zip_storage_path;

        try {
            $chapter = $import->chapter;
            if (! $chapter) {
                throw new RuntimeException('Chapter not found.');
            }

            if (! Storage::exists($zipPath)) {
                throw new RuntimeException('ZIP file is no longer available.');
            }

            $localZip = tempnam(sys_get_temp_dir(), 'chzip_');
            if ($localZip === false) {
                throw new RuntimeException('Could not create temporary file.');
            }

            $stream = Storage::readStream($zipPath);
            if (! $stream) {
                throw new RuntimeException('Could not read ZIP from storage.');
            }

            try {
                $out = fopen($localZip, 'wb');
                if (! $out) {
                    throw new RuntimeException('Could not open temporary ZIP file.');
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

            $count = $service->importChapterImagesFromZip($chapter, $localZip);

            Storage::delete($zipPath);

            $import->update([
                'status' => 'completed',
                'pages_imported' => $count,
                'error_message' => null,
            ]);
        } catch (Throwable $e) {
            $import->update([
                'status' => 'failed',
                'error_message' => $e->getMessage(),
            ]);

            if (Storage::exists($zipPath)) {
                Storage::delete($zipPath);
            }
        } finally {
            if ($localZip && is_file($localZip)) {
                @unlink($localZip);
            }
        }
    }
}
