<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class FrontendErrorReportController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'kind' => 'required|string|max:64',
            'message' => 'required|string|max:1000',
            'status' => 'nullable|integer|min:100|max:599',
            'method' => 'nullable|string|max:16',
            'url' => 'nullable|string|max:1500',
            'source' => 'nullable|string|max:1000',
            'line' => 'nullable|integer|min:0',
            'column' => 'nullable|integer|min:0',
            'stack' => 'nullable|string|max:5000',
            'page_url' => 'nullable|string|max:1500',
            'user_agent' => 'nullable|string|max:1000',
            'release' => 'nullable|string|max:255',
            'sent_at' => 'nullable|date',
        ]);

        if (! app()->environment('production')) {
            return response()->json(['ok' => true], 202);
        }

        if (! filled(config('logging.channels.slack.url'))) {
            return response()->json(['ok' => true], 202);
        }

        if (! $this->shouldReport($validated)) {
            return response()->json(['ok' => true], 202);
        }

        $fingerprint = sha1(implode('|', [
            $validated['kind'],
            $validated['message'],
            $validated['status'] ?? '',
            $validated['url'] ?? '',
            $validated['page_url'] ?? '',
        ]));

        if (! Cache::add("frontend_error_report:{$fingerprint}", true, 60)) {
            return response()->json(['ok' => true], 202);
        }

        Log::channel('slack')->critical('Frontend error reported', $this->sanitize($validated));

        return response()->json(['ok' => true], 202);
    }

    protected function shouldReport(array $payload): bool
    {
        if (($payload['status'] ?? 0) > 0 && ($payload['status'] ?? 0) < 500) {
            return false;
        }

        return in_array($payload['kind'], [
            'runtime_error',
            'unhandled_rejection',
            'request_error',
            'inertia_error',
        ], true);
    }

    protected function sanitize(array $payload): array
    {
        return [
            'kind' => $payload['kind'],
            'message' => $payload['message'],
            'status' => $payload['status'] ?? null,
            'method' => $payload['method'] ?? null,
            'url' => $payload['url'] ?? null,
            'source' => $payload['source'] ?? null,
            'line' => $payload['line'] ?? null,
            'column' => $payload['column'] ?? null,
            'stack' => isset($payload['stack']) ? substr($payload['stack'], 0, 3000) : null,
            'page_url' => $payload['page_url'] ?? null,
            'user_agent' => $payload['user_agent'] ?? null,
            'release' => $payload['release'] ?? null,
            'sent_at' => $payload['sent_at'] ?? null,
            'request_ip' => request()->ip(),
        ];
    }
}
