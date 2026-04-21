

<?php

use App\Http\Controllers\AnimeController;
use App\Http\Controllers\AnimeDetailController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CollectionController;
use App\Http\Controllers\CollectionItemsController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\MangaChapterReaderController;
use App\Http\Controllers\MangaController;
use App\Http\Controllers\MangaDetailController;
use App\Http\Controllers\SubscriberController;
use App\Http\Controllers\UserController;
use App\Models\Banner;
use App\Models\Chapter;
use App\Models\Group;
use App\Models\Manga;
use Carbon\Carbon;
use Illuminate\Support\Facades\Route;

Route::get('/', function (Group $group) {
    $banners = Banner::with('bannerable')
        ->where('group_id', $group->id)
        ->where('bannerable_type', Manga::class)
        ->orderBy('order', 'asc')
        ->get();
    $trendMangas = Manga::with('tags')->where('group_id', $group->id)->where('is_trending', 1)->latest()->take(3)->get();
    $newMangas = Manga::with('tags')->where('group_id', $group->id)->latest()->take(5)->get();
    $recommendedManga = Manga::with('tags')->where('group_id', $group->id)->where('is_recommended', true)->latest()->first();
    $continueReadingMangas = Manga::select('mangas.*')->with(['tags', 'chapters', 'comments'])->withCount(['chapters', 'comments', 'ratings'])->where('mangas.group_id', $group->id)->take(4)->get();
    $popularMangas = Manga::with('tags')->where('group_id', $group->id)->withCount(['comments', 'ratings', 'chapters'])->orderBy('views_count', 'desc')->take(8)->get();
    $hotMangas = Manga::with('tags')->where('group_id', $group->id)->withCount(['comments', 'ratings', 'chapters'])->orderByDesc('likes_count')->orderByDesc('views_count')->take(12)->get();
    $latestMangas = Manga::with('tags')->where('group_id', $group->id)->withCount(['comments', 'ratings', 'chapters'])->latest()->take(12)->get();
    $today = Carbon::today()->toDateString();
    $yesterday = Carbon::yesterday()->toDateString();
    $todayNewEpisodes = Chapter::with('chapterable', 'chapterable.tags')->where('chapterable_type', Manga::class)->whereDate('created_at', $today)->take(6)->get();
    $yesterdayNewEpisodes = Chapter::with('chapterable', 'chapterable.tags')->where('chapterable_type', Manga::class)->whereDate('created_at', $yesterday)->take(6)->get();

    return inertia('Group/Index', [
        'banners' => $banners,
        'trendMangas' => $trendMangas,
        'newMangas' => $newMangas,
        'recommendedManga' => $recommendedManga,
        'continueReadingMangas' => $continueReadingMangas,
        'popularMangas' => $popularMangas,
        'hotMangas' => $hotMangas,
        'latestMangas' => $latestMangas,
        'newEpisodes' => [
            'today' => $todayNewEpisodes,
            'yesterday' => $yesterdayNewEpisodes,
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
Route::get('/mangas/{manga:slug}/chapters/{chapter}', [MangaChapterReaderController::class, 'show'])->name('manga.chapter.read');
Route::get('/animes/{anime:slug}', [AnimeDetailController::class, 'index'])->name('anime.detail');
Route::get('/user/profile/{user}', [UserController::class, 'showUserProfile'])->name('user.profile.show');
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
    Route::get('/forgot-password', function () {
        return inertia('Group/ForgotPassword');
    })->name('password.request');
    Route::post('/forgot-password', [AuthController::class, 'sendPasswordResetLink'])->name('password.email');
    Route::get('/reset-password/{token}', [AuthController::class, 'showResetPasswordForm'])->name('password.reset');
    Route::post('/reset-password', [AuthController::class, 'resetPassword'])->name('password.store');
});
Route::post('/logout', [AuthController::class, 'userLogout'])->name('logout');
