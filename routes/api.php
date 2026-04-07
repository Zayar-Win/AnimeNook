<?php

use App\Http\Controllers\AnimeController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\MentionUserController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\ViewController;
use App\Http\Middleware\GroupMiddleware;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

$isProduction = config('app.env') === 'production';
$groupNotificationRoutes = function () {
    Route::middleware('auth')->group(function () {
        Route::get('/notis', [NotificationController::class, 'index'])->name('notis');
        Route::post('/notis/read-all', [NotificationController::class, 'markAllRead'])->name('notis.read-all');
        Route::post('/notis/{id}/read', [NotificationController::class, 'markRead'])->name('notis.read');
        Route::get('/users/mention-suggestions', [MentionUserController::class, 'index'])->name('users.mention-suggestions');
    });
};

if ($isProduction) {
    Route::domain('{group:subdomain}'.'.'.config('app.url'))->middleware(GroupMiddleware::class)->name('group.')->group(function () use ($groupNotificationRoutes) {
        Route::get('/search', [SearchController::class, 'search'])->name('search');
        Route::post('/views/store', [ViewController::class, 'store'])->name('views.store');
        $groupNotificationRoutes();
    });
} else {
    Route::prefix('/{group:subdomain}')->middleware(GroupMiddleware::class)->name('group.')->group(function () use ($groupNotificationRoutes) {
        Route::get('/search', [SearchController::class, 'search'])->name('search');
        Route::post('/views/store', [ViewController::class, 'store'])->name('views.store');
        Route::get('/animes-api', [AnimeController::class, 'index'])->name('getAnimesAndMangas');
        $groupNotificationRoutes();
    });
}

Route::post('/images/store', [ImageController::class, 'store'])->name('images.store');
