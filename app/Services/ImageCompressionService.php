<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;
use Throwable;

class ImageCompressionService
{
    private ImageManager $manager;

    public function __construct()
    {
        $this->manager = new ImageManager(new Driver);
    }

    /**
     * @return array{contents:string,mime:string,extension:string,compressed:bool}
     */
    public function compressUploadedFile(UploadedFile $file): array
    {
        return $this->compressBinary(
            $file->get(),
            $file->getMimeType(),
            $file->getClientOriginalExtension()
        );
    }

    /**
     * @return array{contents:string,mime:string,extension:string,compressed:bool}
     */
    public function compressPath(string $path, ?string $mime = null, ?string $extension = null): array
    {
        return $this->compressBinary(
            (string) file_get_contents($path),
            $mime,
            $extension ?? pathinfo($path, PATHINFO_EXTENSION)
        );
    }

    /**
     * @return array{contents:string,mime:string,extension:string,compressed:bool}
     */
    public function compressBinary(string $contents, ?string $mime = null, ?string $extension = null): array
    {
        $fallback = $this->fallbackPayload($contents, $mime, $extension);

        if (! config('image-compression.enabled', true)) {
            return $fallback;
        }

        $normalized = $this->normalizeType($mime, $extension);
        if ($normalized === null) {
            return $fallback;
        }

        try {
            $image = $this->manager->read($contents);
            $image = $image->scaleDown(
                width: max(1, (int) config('image-compression.max_width', 2000)),
                height: max(1, (int) config('image-compression.max_height', 2000))
            );

            $quality = max(1, min(100, (int) config('image-compression.webp_quality', 75)));
            $encodedContents = (string) $image->toWebp(quality: $quality);

            // Only use WebP if it is actually smaller than the original.
            if (strlen($encodedContents) >= strlen($contents)) {
                return $fallback;
            }

            return [
                'contents' => $encodedContents,
                'mime' => 'image/webp',
                'extension' => 'webp',
                'compressed' => true,
            ];
        } catch (Throwable $e) {
            if (config('image-compression.fail_on_error', false)) {
                throw $e;
            }

            Log::warning('Image compression failed; using original payload.', [
                'mime' => $mime,
                'extension' => $extension,
                'error' => $e->getMessage(),
            ]);

            return $fallback;
        }
    }

    private function mimeForType(string $type): string
    {
        return match ($type) {
            'jpg' => 'image/jpeg',
            'png' => 'image/png',
            'webp' => 'image/webp',
            default => 'application/octet-stream',
        };
    }

    private function normalizeType(?string $mime, ?string $extension): ?string
    {
        $mime = strtolower((string) $mime);
        $extension = strtolower(ltrim((string) $extension, '.'));

        if (in_array($mime, ['image/jpeg', 'image/jpg'], true) || in_array($extension, ['jpg', 'jpeg'], true)) {
            return 'jpg';
        }
        if ($mime === 'image/png' || $extension === 'png') {
            return 'png';
        }
        if ($mime === 'image/webp' || $extension === 'webp') {
            return 'webp';
        }

        return null;
    }

    /**
     * @return array{contents:string,mime:string,extension:string,compressed:bool}
     */
    private function fallbackPayload(string $contents, ?string $mime, ?string $extension): array
    {
        $normalized = $this->normalizeType($mime, $extension);

        if ($normalized !== null) {
            return [
                'contents' => $contents,
                'mime' => $this->mimeForType($normalized),
                'extension' => $normalized,
                'compressed' => false,
            ];
        }

        return [
            'contents' => $contents,
            'mime' => $mime ?: 'application/octet-stream',
            'extension' => $extension ? strtolower(ltrim($extension, '.')) : 'bin',
            'compressed' => false,
        ];
    }
}

