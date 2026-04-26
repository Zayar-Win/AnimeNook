<?php

namespace App\Http\Controllers;

use App\helpers\Uploader;
use App\Models\Group;
use App\Models\UploadSession;
use Aws\S3\S3Client;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class GroupAdminChunkUploadController extends Controller
{
    public function __construct(private readonly Uploader $uploader) {}

    public function signSpacesUpload(Group $group, Request $request)
    {
        $validated = $request->validate([
            'target' => ['required', 'in:chapter-image,chapter-pdf'],
            'file_name' => ['required', 'string', 'max:255'],
            'content_type' => ['nullable', 'string', 'max:255'],
        ]);

        $target = $validated['target'];
        $contentType = $validated['content_type'] ?? null;
        if ($target === 'chapter-pdf' && $contentType && $contentType !== 'application/pdf') {
            return response()->json(['message' => 'Only PDF is allowed'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
        if ($target === 'chapter-image' && $contentType && ! Str::startsWith($contentType, 'image/')) {
            return response()->json(['message' => 'Only image files are allowed'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $safeName = preg_replace('/[^A-Za-z0-9._-]+/', '_', $validated['file_name']) ?: 'upload.bin';
        $key = 'mangas/' . now()->timestamp . '_' . Str::uuid() . '_' . $safeName;

        $disk = config('filesystems.disks.do_spaces');
        $bucket = $disk['bucket'] ?? null;
        if (! $bucket) {
            return response()->json(['message' => 'DO Spaces bucket is not configured'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        $client = new S3Client([
            'version' => 'latest',
            'region' => $disk['region'] ?? env('DO_SPACES_DEFAULT_REGION', 'sgp1'),
            'endpoint' => $disk['endpoint'] ?? null,
            'credentials' => [
                'key' => $disk['key'] ?? null,
                'secret' => $disk['secret'] ?? null,
            ],
        ]);

        $command = $client->getCommand('PutObject', [
            'Bucket' => $bucket,
            'Key' => $key,
            'ACL' => 'public-read',
            'ContentType' => $contentType ?: 'application/octet-stream',
        ]);
        $presigned = $client->createPresignedRequest($command, '+20 minutes');
        $uploadUrl = (string) $presigned->getUri();

        $baseUrl = rtrim((string) ($disk['url'] ?? ''), '/');
        $publicUrl = $baseUrl . '/' . $key;

        return response()->json([
            'upload_url' => $uploadUrl,
            'public_url' => $publicUrl,
            'key' => $key,
        ]);
    }

    /**
     * FilePond chunk init endpoint.
     *
     * When chunkUploads=true, FilePond first sends a POST request without a file
     * and expects a unique transfer id in the response body.
     */
    public function process(Group $group, Request $request)
    {
        $userId = (int) $request->user()->id;

        $target = (string) $request->header('X-Upload-Target', '');
        if (! in_array($target, ['chapter-image', 'chapter-pdf'], true)) {
            return response('Invalid upload target', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $originalName = (string) $request->header('Upload-Name', '');
        $originalName = trim($originalName) !== '' ? $originalName : 'upload.bin';

        $mime = $request->header('Upload-Type');
        $sizeBytes = $request->header('Upload-Length');
        $sizeBytes = is_numeric($sizeBytes) ? (int) $sizeBytes : null;

        if ($target === 'chapter-pdf') {
            if ($mime !== null && $mime !== 'application/pdf') {
                return response('Only PDF files allowed', Response::HTTP_UNPROCESSABLE_ENTITY);
            }
        }

        if ($target === 'chapter-image') {
            if ($mime !== null && ! Str::startsWith((string) $mime, 'image/')) {
                return response('Only image files allowed', Response::HTTP_UNPROCESSABLE_ENTITY);
            }
        }

        $id = (string) Str::uuid();

        UploadSession::create([
            'id' => $id,
            'user_id' => $userId,
            'group_id' => $group->id,
            'target' => $target,
            'original_name' => $originalName,
            'mime' => $mime,
            'size_bytes' => $sizeBytes,
            'stored_url' => null,
            'status' => 'uploading',
        ]);

        $dir = $this->tempDir($id);
        File::ensureDirectoryExists($dir);

        return response($id, Response::HTTP_OK)->header('Content-Type', 'text/plain');
    }

    /**
     * FilePond chunk upload & resume endpoint.
     *
     * - HEAD returns current Upload-Offset (next expected byte)
     * - PATCH appends bytes and returns 204 with Upload-Offset
     */
    public function patch(Group $group, Request $request, string $upload)
    {
        /** @var UploadSession|null $session */
        $session = UploadSession::query()
            ->where('id', $upload)
            ->where('group_id', $group->id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (! $session) {
            return response('Upload not found', Response::HTTP_NOT_FOUND);
        }

        if ($session->status !== 'uploading') {
            return response('Upload not active', Response::HTTP_CONFLICT);
        }

        $partPath = $this->tempFilePath($upload);
        File::ensureDirectoryExists(dirname($partPath));

        $currentOffset = file_exists($partPath) ? (int) filesize($partPath) : 0;

        if ($request->isMethod('HEAD')) {
            return response('', Response::HTTP_OK)
                ->header('Upload-Offset', (string) $currentOffset);
        }

        if (! $request->isMethod('PATCH')) {
            return response('Method not allowed', Response::HTTP_METHOD_NOT_ALLOWED);
        }

        $expectedOffset = $request->header('Upload-Offset');
        $expectedOffset = is_numeric($expectedOffset) ? (int) $expectedOffset : null;

        if ($expectedOffset === null) {
            return response('Missing Upload-Offset', Response::HTTP_BAD_REQUEST);
        }

        if ($expectedOffset !== $currentOffset) {
            return response('Offset mismatch', Response::HTTP_CONFLICT)
                ->header('Upload-Offset', (string) $currentOffset);
        }

        $totalLength = $request->header('Upload-Length');
        $totalLength = is_numeric($totalLength) ? (int) $totalLength : null;
        if ($totalLength !== null && (int) $session->size_bytes !== $totalLength) {
            $session->size_bytes = $totalLength;
            $session->save();
        }

        $bytes = $request->getContent();
        if ($bytes === '') {
            return response('Empty chunk', Response::HTTP_BAD_REQUEST)
                ->header('Upload-Offset', (string) $currentOffset);
        }

        $fh = fopen($partPath, 'ab');
        if (! $fh) {
            return response('Failed to open upload temp file', Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        try {
            fwrite($fh, $bytes);
        } finally {
            fclose($fh);
        }

        $newOffset = $currentOffset + strlen($bytes);

        if ($totalLength !== null && $newOffset >= $totalLength) {
            $storedUrl = $this->finalizeUpload($session, $partPath);
            $session->stored_url = $storedUrl;
            $session->status = 'complete';
            $session->save();

            $this->cleanupTemp($upload);
        }

        return response('', Response::HTTP_NO_CONTENT)
            ->header('Upload-Offset', (string) $newOffset);
    }

    /**
     * FilePond revert endpoint.
     *
     * FilePond sends serverId (upload id) as the request body.
     */
    public function revert(Group $group, Request $request)
    {
        $id = trim((string) $request->getContent());
        if ($id === '') {
            return response('', Response::HTTP_OK);
        }

        /** @var UploadSession|null $session */
        $session = UploadSession::query()
            ->where('id', $id)
            ->where('group_id', $group->id)
            ->where('user_id', $request->user()->id)
            ->first();

        if ($session) {
            if ($session->stored_url) {
                $this->uploader->remove($session->stored_url);
            }
            $session->status = 'aborted';
            $session->save();
            $session->delete();
        }

        $this->cleanupTemp($id);

        return response('', Response::HTTP_OK);
    }

    /**
     * Axios-friendly chunk upload init.
     */
    public function initChunk(Group $group, Request $request)
    {
        $validated = $request->validate([
            'target' => ['required', 'in:chapter-image,chapter-pdf'],
            'file_name' => ['required', 'string', 'max:255'],
            'content_type' => ['nullable', 'string', 'max:255'],
            'size_bytes' => ['required', 'integer', 'min:1'],
        ]);

        $target = $validated['target'];
        $contentType = $validated['content_type'] ?? null;

        if ($target === 'chapter-pdf' && $contentType && $contentType !== 'application/pdf') {
            return response()->json(['message' => 'Only PDF is allowed'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
        if ($target === 'chapter-image' && $contentType && ! Str::startsWith($contentType, 'image/')) {
            return response()->json(['message' => 'Only image files are allowed'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $userId = (int) $request->user()->id;
        $id = (string) Str::uuid();

        $originalName = trim((string) $validated['file_name']);
        $originalName = $originalName !== '' ? $originalName : 'upload.bin';

        UploadSession::create([
            'id' => $id,
            'user_id' => $userId,
            'group_id' => $group->id,
            'target' => $target,
            'original_name' => $originalName,
            'mime' => $contentType,
            'size_bytes' => (int) $validated['size_bytes'],
            'stored_url' => null,
            'status' => 'uploading',
        ]);

        File::ensureDirectoryExists($this->tempDir($id));

        return response()->json(['upload_id' => $id]);
    }

    /**
     * Axios-friendly chunk append.
     *
     * Expects multipart/form-data:
     * - chunk: file (Blob)
     * - offset: integer (current offset)
     * - total_size: integer (full size)
     */
    public function uploadChunk(Group $group, Request $request, string $upload)
    {
        /** @var UploadSession|null $session */
        $session = UploadSession::query()
            ->where('id', $upload)
            ->where('group_id', $group->id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (! $session) {
            return response()->json(['message' => 'Upload not found'], Response::HTTP_NOT_FOUND);
        }
        if ($session->status !== 'uploading') {
            return response()->json(['message' => 'Upload not active'], Response::HTTP_CONFLICT);
        }

        $validated = $request->validate([
            'offset' => ['required', 'integer', 'min:0'],
            'total_size' => ['required', 'integer', 'min:1'],
            'chunk' => ['required', 'file'],
        ]);

        /** @var UploadedFile $chunk */
        $chunk = $request->file('chunk');
        $expectedOffset = (int) $validated['offset'];
        $totalSize = (int) $validated['total_size'];

        if ((int) $session->size_bytes !== $totalSize) {
            $session->size_bytes = $totalSize;
            $session->save();
        }

        $partPath = $this->tempFilePath($upload);
        File::ensureDirectoryExists(dirname($partPath));

        $currentOffset = file_exists($partPath) ? (int) filesize($partPath) : 0;
        if ($expectedOffset !== $currentOffset) {
            return response()->json([
                'message' => 'Offset mismatch',
                'next_offset' => $currentOffset,
            ], Response::HTTP_CONFLICT);
        }

        $fh = fopen($partPath, 'ab');
        if (! $fh) {
            return response()->json(['message' => 'Failed to open temp file'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        try {
            $in = fopen($chunk->getRealPath(), 'rb');
            if (! $in) {
                return response()->json(['message' => 'Failed to read chunk'], Response::HTTP_INTERNAL_SERVER_ERROR);
            }
            try {
                $copied = stream_copy_to_stream($in, $fh);
                if ($copied === false) {
                    return response()->json(['message' => 'Failed to write chunk'], Response::HTTP_INTERNAL_SERVER_ERROR);
                }
                fflush($fh);
            } finally {
                fclose($in);
            }
        } finally {
            fclose($fh);
        }

        // filesize() is stat-cached per request; refresh after append.
        clearstatcache(true, $partPath);
        $nextOffset = (int) filesize($partPath);
        if ($nextOffset <= $currentOffset) {
            return response()->json([
                'message' => 'Chunk write produced no progress',
                'next_offset' => $currentOffset,
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response()->json([
            'next_offset' => $nextOffset,
            'done' => $nextOffset >= $totalSize,
        ]);
    }

    /**
     * Axios-friendly finalize assembled file.
     */
    public function finishChunk(Group $group, Request $request, string $upload)
    {
        /** @var UploadSession|null $session */
        $session = UploadSession::query()
            ->where('id', $upload)
            ->where('group_id', $group->id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (! $session) {
            return response()->json(['message' => 'Upload not found'], Response::HTTP_NOT_FOUND);
        }
        if ($session->status !== 'uploading') {
            return response()->json(['message' => 'Upload not active'], Response::HTTP_CONFLICT);
        }

        $partPath = $this->tempFilePath($upload);
        if (! file_exists($partPath)) {
            return response()->json(['message' => 'No data uploaded'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $currentSize = (int) filesize($partPath);
        $expectedSize = $session->size_bytes ? (int) $session->size_bytes : null;
        if ($expectedSize !== null && $currentSize < $expectedSize) {
            return response()->json([
                'message' => 'Upload incomplete',
                'next_offset' => $currentSize,
            ], Response::HTTP_CONFLICT);
        }

        $url = $this->finalizeUpload($session, $partPath);
        $session->stored_url = $url;
        $session->status = 'complete';
        $session->save();

        $this->cleanupTemp($upload);

        // We don't need to keep the row around once we returned the final URL.
        $session->delete();

        return response()->json(['url' => $url]);
    }

    public function abortChunk(Group $group, Request $request, string $upload)
    {
        /** @var UploadSession|null $session */
        $session = UploadSession::query()
            ->where('id', $upload)
            ->where('group_id', $group->id)
            ->where('user_id', $request->user()->id)
            ->first();

        if ($session) {
            if ($session->stored_url) {
                $this->uploader->remove($session->stored_url);
            }
            $session->status = 'aborted';
            $session->save();
            $session->delete();
        }

        $this->cleanupTemp($upload);

        return response()->json(['ok' => true]);
    }

    private function tempDir(string $id): string
    {
        return storage_path('app/chunk-uploads/' . $id);
    }

    private function tempFilePath(string $id): string
    {
        return $this->tempDir($id) . '/upload.part';
    }

    private function cleanupTemp(string $id): void
    {
        $dir = $this->tempDir($id);
        if (is_dir($dir)) {
            File::deleteDirectory($dir);
        }
    }

    private function finalizeUpload(UploadSession $session, string $partPath): string
    {
        // Store under the same "mangas" container used by chapter uploads today.
        $container = 'mangas';

        $safeOriginal = preg_replace('/[^A-Za-z0-9._-]+/', '_', $session->original_name) ?: 'upload.bin';
        $finalName = Carbon::now()->timestamp . '_' . $safeOriginal;
        $finalPath = $container . '/' . $finalName;

        $stream = fopen($partPath, 'rb');
        if (! $stream) {
            throw new \RuntimeException('Failed to open assembled file');
        }

        try {
            Storage::put($finalPath, $stream);
        } finally {
            fclose($stream);
        }

        return Storage::url($finalPath);
    }
}
