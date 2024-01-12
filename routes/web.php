<?php

use App\Http\Controllers\AnimeDetailController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\MangaDetailController;
use App\Http\Controllers\ProfileController;
use App\Models\Anime;
use App\Models\Chapter;
use App\Models\Group;
use App\Models\Manga;
use Carbon\Carbon;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\URL;
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
URL::defaults(['group' => 'delta']);
if ($isProduction) {
    Route::domain('{group:subdomain}' . config('app.url'))->name('group')->group(function () {
        Route::get('/', function () {
            return inertia('Group/Index', []);
        });
    });
} else {
    Route::prefix('/{group:subdomain}')->name('group.')->group(function () {
        Route::get('/', function (Group $group) {
            $trendAnimes = Anime::with('tags')->where('group_id', $group->id)->where('is_trending', 1)->latest()->take(3)->get();
            $newAnimes = Anime::with('tags')->where('group_id', $group->id)->latest()->take(5)->get();
            $recommendedAnime = Anime::with('tags')->where('group_id',  $group->id)->where('is_recommended', true)->latest()->first();
            $continueWatchingAnimes = Anime::select('animes.*')->with(['tags', 'chapters', 'comments'])->withCount(['chapters', 'comments', 'ratings'])->where('animes.group_id', $group->id)->take(4)->get();
            $popularAnimes = Anime::with('tags')->where('group_id', $group->id)->withCount(['comments',  'ratings', 'chapters'])->orderBy('views_count', 'desc')->take(4)->get();
            $popularMangas = Manga::with('tags')->where('group_id', $group->id)->withCount(['comments', 'ratings', 'chapters'])->orderBy('views_count', 'desc')->take(8)->get();
            $today = Carbon::today()->toDateString();
            $yesterday =  Carbon::yesterday()->toDateString();
            $todayNewEpisodes = Chapter::with('chapterable', 'chapterable.tags')->whereDate('created_at', $today)->take(6)->get();
            $yesterdayNewEpisodes = Chapter::with('chapterable', 'chapterable.tags')->whereDate('created_at', $yesterday)->take(6)->get();
            return inertia('Group/Index', [
                'trendAnimes' => $trendAnimes,
                'newAnimes' => $newAnimes,
                'recommendedAnime' => $recommendedAnime,
                'continueWatchingAnimes' => $continueWatchingAnimes,
                'popularAnimes' => $popularAnimes,
                'popularMangas' => $popularMangas,
                'newEpisodes' => [
                    'today' => $todayNewEpisodes,
                    'yesterday' => $yesterdayNewEpisodes
                ],
            ]);
        })->name('home');
        Route::get('/mangas/{manga:slug}', [MangaDetailController::class, 'index'])->name('manga.detail');
        Route::get('/animes/{anime:slug}', [AnimeDetailController::class, 'index'])->name('anime.detail');
        Route::post('/remove-bg', [ImageController::class, 'removeBg'])->name('removeBg');
        Route::get('/login', function () {
            return inertia('Group/Login');
        })->name('login');
        Route::post('/login', [AuthController::class, 'userLogin'])->name('login');
        Route::get('/register', function () {
            return inertia('Group/Register');
        })->name('register');
        Route::post('/register', [AuthController::class, 'userRegister'])->name('register');
        Route::post('/logout', [AuthController::class, 'userLogout'])->name('logout');
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
