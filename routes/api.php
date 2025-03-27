<?php

use App\Http\Controllers\AnimeController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\ViewController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\URL;

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
URL::defaults(['group' => 'delta']);
if ($isProduction) {
    Route::domain('{group:subdomain}' . config('app.url'))->name('group')->group(function () {
        Route::get('/search', [SearchController::class, 'search'])->name('search');
        Route::post('/views/store', [ViewController::class, 'store'])->name('views.store');
    });
} else {
    Route::prefix('/{group:subdomain}')->name('group.')->group(function () {
        Route::get('/search', [SearchController::class, 'search'])->name('search');
        Route::get('/notis', [NotificationController::class, 'index'])->name('notis');
        Route::post('/views/store', [ViewController::class, 'store'])->name('views.store');
        Route::get('/animes-api', [AnimeController::class, 'index'])->name('getAnimesAndMangas');
    });
}

Route::post('/images/store', [ImageController::class, 'store'])->name('images.store');
