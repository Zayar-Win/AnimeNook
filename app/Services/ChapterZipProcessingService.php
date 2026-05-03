<?php

namespace App\Services;

use App\helpers\Uploader;
use App\Models\Chapter;
use App\Models\ChapterImage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;
use ZipArchive;

class ChapterZipProcessingService
{
    public function __construct(private readonly Uploader $uploader) {}

    /**
     * Quick validation before queueing: readable ZIP and non-empty.
     *
     * @throws RuntimeException
     */
    public function assertZipReadable(string $localZipPath): void
    {
        if (! is_readable($localZipPath)) {
            throw new RuntimeException('ZIP file is not readable.');
        }

        $zip = new ZipArchive;
        $code = $zip->open($localZipPath, ZipArchive::RDONLY);
        if ($code !== true) {
            throw new RuntimeException('Invalid or corrupted ZIP file.');
        }

        try {
            if ($zip->numFiles < 1) {
                throw new RuntimeException('ZIP archive is empty.');
            }
        } finally {
            $zip->close();
        }
    }

    /**
     * Same index-order scan as extraction, but only checks for plausible image entries (extension + path rules).
     * Used to reject ZIPs with no image candidates before queueing.
     *
     * @throws RuntimeException
     */
    public function assertZipHasCandidateImages(string $localZipPath): void
    {
        $zip = new ZipArchive;
        if ($zip->open($localZipPath, ZipArchive::RDONLY) !== true) {
            throw new RuntimeException('Invalid or corrupted ZIP file.');
        }

        try {
            for ($i = 0; $i < $zip->numFiles; $i++) {
                $name = $zip->getNameIndex($i);
                if ($name === false) {
                    continue;
                }

                if ($this->looksLikeDirectoryName($name)) {
                    continue;
                }

                if (! $this->isSafeZipEntryName($name)) {
                    continue;
                }

                if ($this->shouldSkipEntry($name)) {
                    continue;
                }

                if ($this->hasAllowedImageExtension($name)) {
                    return;
                }
            }

            throw new RuntimeException('No valid images found in ZIP.');
        } finally {
            $zip->close();
        }
    }

    /**
     * Full extraction: preserves central-directory order via index iteration.
     *
     * @return int Number of page images stored
     *
     * @throws RuntimeException
     */
    public function importChapterImagesFromZip(Chapter $chapter, string $localZipPath): int
    {
        $maxImages = (int) config('chapter_zip.max_extracted_files', 500);

        $zip = new ZipArchive;
        if ($zip->open($localZipPath, ZipArchive::RDONLY) !== true) {
            throw new RuntimeException('Invalid or corrupted ZIP file.');
        }

        try {
            if ($zip->numFiles < 1) {
                throw new RuntimeException('ZIP archive is empty.');
            }

            $pending = [];

            for ($i = 0; $i < $zip->numFiles; $i++) {
                $name = $zip->getNameIndex($i);
                if ($name === false) {
                    continue;
                }

                if ($this->looksLikeDirectoryName($name)) {
                    continue;
                }

                if (! $this->isSafeZipEntryName($name)) {
                    continue;
                }

                if ($this->shouldSkipEntry($name)) {
                    continue;
                }

                if (! $this->hasAllowedImageExtension($name)) {
                    continue;
                }

                $stat = $zip->statIndex($i);
                if ($stat === false) {
                    continue;
                }

                if (($stat['size'] ?? 0) === 0 && $this->looksLikeDirectoryName($name)) {
                    continue;
                }

                if (($stat['size'] ?? 0) < 1) {
                    continue;
                }

                $contents = $zip->getFromIndex($i);
                if ($contents === false || $contents === '') {
                    continue;
                }

                if (! $this->isAllowedImageMime($contents)) {
                    continue;
                }

                if (count($pending) >= $maxImages) {
                    throw new RuntimeException('Too many images in ZIP (max '.$maxImages.').');
                }

                $pending[] = [
                    'contents' => $contents,
                    'ext' => $this->normalizedExtension($name),
                ];
            }

            if ($pending === []) {
                throw new RuntimeException('No valid images found in ZIP.');
            }

            return DB::transaction(function () use ($chapter, $pending) {
                $chapter->loadMissing('images');

                if ($chapter->pdf_path) {
                    $this->uploader->remove($chapter->pdf_path);
                }

                foreach ($chapter->images as $image) {
                    $this->uploader->remove($image->path);
                    $image->delete();
                }

                $chapter->update([
                    'type' => 'link',
                    'pdf_path' => null,
                ]);

                $order = 1;
                foreach ($pending as $row) {
                    $storedUrl = $this->storeImageBlob($row['contents'], $row['ext'], $chapter->id, $order);

                    ChapterImage::create([
                        'chapter_id' => $chapter->id,
                        'path' => $storedUrl,
                        'order' => $order,
                    ]);

                    $order++;
                }

                return count($pending);
            });
        } finally {
            $zip->close();
        }
    }

    private function storeImageBlob(string $contents, string $ext, int $chapterId, int $order): string
    {
        $ext = strtolower(ltrim($ext, '.'));
        $safeExt = in_array($ext, ['jpg', 'jpeg', 'png', 'webp'], true) ? $ext : 'bin';
        $filename = 'ch'.$chapterId.'_p'.$order.'_'.Str::uuid().'.'.$safeExt;
        $path = 'mangas/'.$filename;

        Storage::put($path, $contents);

        return Storage::url($path);
    }

    private function isSafeZipEntryName(string $name): bool
    {
        $name = str_replace('\\', '/', $name);
        $name = ltrim($name, '/');

        foreach (explode('/', $name) as $segment) {
            if ($segment === '' || $segment === '.' || $segment === '..') {
                return false;
            }
        }

        return true;
    }

    private function shouldSkipEntry(string $name): bool
    {
        $normalized = str_replace('\\', '/', $name);

        if (str_contains($normalized, ':')) {
            return true;
        }

        if (preg_match('#(^|/)__MACOSX(/|$)#i', $normalized)) {
            return true;
        }

        $base = strtolower(basename($normalized));

        return $base === '.ds_store';
    }

    private function looksLikeDirectoryName(string $name): bool
    {
        return str_ends_with(str_replace('\\', '/', $name), '/');
    }

    private function hasAllowedImageExtension(string $name): bool
    {
        $ext = strtolower(pathinfo(str_replace('\\', '/', $name), PATHINFO_EXTENSION));

        return in_array($ext, ['jpg', 'jpeg', 'png', 'webp'], true);
    }

    private function normalizedExtension(string $name): string
    {
        return strtolower(pathinfo(str_replace('\\', '/', $name), PATHINFO_EXTENSION));
    }

    private function isAllowedImageMime(string $binary): bool
    {
        if (function_exists('finfo_open')) {
            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            if ($finfo) {
                $mime = finfo_buffer($finfo, $binary);
                finfo_close($finfo);
            } else {
                $mime = null;
            }
        } else {
            $mime = null;
        }

        if ($mime === null || $mime === '') {
            return false;
        }

        return in_array($mime, ['image/jpeg', 'image/png', 'image/webp'], true);
    }
}
