<?php

namespace App\Exceptions;

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Session\TokenMismatchException;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
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
            if (! $this->shouldReportToSlack($e)) {
                return;
            }

            Log::channel('slack')->critical('Backend exception occurred', [
                'type' => get_class($e),
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'url' => request()?->fullUrl(),
                'method' => request()?->method(),
                'ip' => request()?->ip(),
            ]);
        });
    }

    protected function shouldReportToSlack(Throwable $e): bool
    {
        if (! app()->environment('production')) {
            return false;
        }

        if (! filled(config('logging.channels.slack.url'))) {
            return false;
        }

        if ($e instanceof ValidationException
            || $e instanceof AuthenticationException
            || $e instanceof AuthorizationException
            || $e instanceof NotFoundHttpException
            || $e instanceof TokenMismatchException) {
            return false;
        }

        if ($e instanceof HttpExceptionInterface) {
            $status = $e->getStatusCode();
            if ($status < 500) {
                return false;
            }

            // Planned maintenance mode should not trigger incident alerts.
            if ($status === 503 && app()->isDownForMaintenance()) {
                return false;
            }
        }

        return true;
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
