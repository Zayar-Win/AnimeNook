

<?php

use App\Http\Controllers\AnimeController;
use App\Http\Controllers\AnimeDetailController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BannerController;
use App\Http\Controllers\CollectionController;
use App\Http\Controllers\CollectionItemsController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\MangaController;
use App\Http\Controllers\MangaDetailController;
use App\Http\Controllers\SubscriberController;
use App\Http\Controllers\UserController;
use App\Models\Anime;
use App\Models\Banner;
use App\Models\Chapter;
use App\Models\Group;
use App\Models\Manga;
use Carbon\Carbon;
use Illuminate\Support\Facades\Route;


Route::get('/', function (Group $group) {
    $banners = Banner::with('bannerable')->where('group_id', $group->id)->latest()->get();
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
        'banners' => $banners,
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

Route::get('/animes', [AnimeController::class, 'index'])->name('animes');
Route::post('/subscriber/store', [SubscriberController::class, 'store'])->name('subscriber.store');
Route::middleware('auth')->group(function () {
    Route::post('/comments/create', [CommentController::class, 'store'])->name('comment.create');
    Route::post('/comments/update', [CommentController::class, 'update'])->name('comment.update');
    Route::post('/mangas/{manga:slug}/like', [MangaController::class, 'like'])->name('manga.like');
    Route::post('/animes/{anime:slug}/like', [AnimeController::class, 'likeOrUnlike'])->name('anime.like');
    Route::post('/comments/{comment:id}/like', [CommentController::class, 'likeOrUnlike'])->name('comment.like');
    Route::post('/comments/{comment}/delete', [CommentController::class, 'deleteComment'])->name('comment.delete');
    Route::post('/animes/{anime}/rating', [AnimeController::class, 'rating'])->name('anime.rating');
    Route::post('/mangas/{manga}/rating', [MangaController::class, 'rating'])->name('manga.rating');
    Route::post('/collections/{collection}/save', [CollectionItemsController::class, 'saveOrUnSave'])->name('item.save');
    Route::get('/savelist', [CollectionController::class, 'index'])->name('savelist');
    Route::post('/collections/{collection}/items/{item}', [CollectionController::class, 'removeSaveItem'])->name('remove.save.item');
    Route::get('/user/profile', [UserController::class, 'showProfile'])->name('user.profile');
    Route::post('/user/profile/update', [UserController::class, 'update'])->name('users.profile.update');
});

Route::get('/mangas/{manga:slug}', [MangaDetailController::class, 'index'])->name('manga.detail');
Route::get('/animes/{anime:slug}', [AnimeDetailController::class, 'index'])->name('anime.detail');
Route::post('/remove-bg', [ImageController::class, 'removeBg'])->name('removeBg');
Route::middleware('guest')->group(function () {
    Route::get('/login', function () {
        return inertia('Group/Login');
    })->name('login');

    Route::post('/login', [AuthController::class, 'userLogin'])->name('login');
    Route::get('/register', function () {
        return inertia('Group/Register');
    })->name('register');
    Route::get('/google-oauth-login', [AuthController::class, 'googleOauthLogin'])->name('google.oauth.login');
    Route::post('/register', [AuthController::class, 'userRegister'])->name('register');
});
Route::post('/logout', [AuthController::class, 'userLogout'])->name('logout');
