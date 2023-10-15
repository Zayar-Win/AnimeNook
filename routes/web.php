<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

$isProduction = config('app.env') === 'production';

if ($isProduction) {
    Route::domain('{group:subdomain}' . config('app.url'))->name('group')->group(function () {
        Route::get('/', function () {
            return inertia('Group/Index', []);
        });
    });
} else {
    Route::prefix('{group:subdomain}')->name('group.')->group(function () {
        Route::get('/', function () {
            return inertia('Group/Index', []);
        });
    });
}

Route::get('/', function () {
    // return Inertia::render('Group/Index');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
