<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    public function render($request, Throwable $e)
    {
        $response = parent::render($request, $e);

        if (app()->environment(['local', 'testing']) || $request->expectsJson()) {
            return $response;
        }

        $status = $response->getStatusCode();
        $handled = [403, 404, 500, 503];

        if (! in_array($status, $handled, true)) {
            $status = $e instanceof HttpExceptionInterface
                ? $e->getStatusCode()
                : 500;
        }

        if (! in_array($status, $handled, true)) {
            return $response;
        }

        if (app()->isDownForMaintenance() && $status === 503) {
            return response()->view('errors.503', [], 503);
        }

        if (! $request->header('X-Inertia')) {
            return response()->view('errors.app', [
                'status' => $status,
            ], $status);
        }

        return Inertia::render('Error', [
            'status' => $status,
        ])->toResponse($request)->setStatusCode($status);
    }
}
