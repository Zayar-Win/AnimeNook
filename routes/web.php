<?php

use App\Http\Controllers\AnimeController;
use App\Http\Controllers\AnimeDetailController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CollectionController;
use App\Http\Controllers\CollectionItemsController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GroupAdminAnimeController;
use App\Http\Controllers\GroupAdminCommentController;
use App\Http\Controllers\GroupAdminMangaController;
use App\Http\Controllers\GroupAdminSubscriberController;
use App\Http\Controllers\GroupAdminUserController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\MangaController;
use App\Http\Controllers\MangaDetailController;
use App\Http\Controllers\ProfileController;
use App\Models\Anime;
use App\Models\Chapter;
use App\Models\Group;
use App\Models\Manga;
use Carbon\Carbon;
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
// URL::defaults(['group' => 'delta']);
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
        Route::get('/animes', [AnimeController::class, 'index'])->name('animes');
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
        });
        Route::name('admin.')->middleware(['auth', 'admin'])->group(function () {
            Route::get('/admin/dashboard', [DashboardController::class, 'index'])->name('dashboard');
            //User Routes
            Route::get('/admin/users',[GroupAdminUserController::class,'index'])->name('users');
            Route::get('/admin/users/create',[GroupAdminUserController::class,'create'])->name('create');
            Route::post('/admin/users/store',[GroupAdminUserController::class,'store'])->name('users.store');   
            Route::get('/admin/users/{user}/edit',[GroupAdminUserController::class,'edit'])->name('users.edit');   
            Route::post('/admin/users/{user}/update',[GroupAdminUserController::class,'update'])->name('users.update');   
            Route::post('/admin/users/{user}/delete',[GroupAdminUserController::class,'delete'])->name('users.delete');   
            // Subscriber Routes
            Route::get('/admin/subscribers',[GroupAdminSubscriberController::class,'index'])->name('subscribers');
            Route::get('/admin/subscribers/{subscriber}/edit',[GroupAdminSubscriberController::class,'edit'])->name('subscribers.edit');
            Route::post('/admin/subscribers/{subscriber}/update',[GroupAdminSubscriberController::class,'update'])->name('subscribers.update');
            Route::post('/admin/subscribers/{subscriber}/delete',[GroupAdminSubscriberController::class,'delete'])->name('subscribers.delete');
            // Anime Routes
            Route::get('/admin/animes',[GroupAdminAnimeController::class,'index'])->name('animes');
            Route::get('/admin/animes/create',[GroupAdminAnimeController::class,'create'])->name('animes.create');
            Route::get('/admin/animes/{anime}/edit',[GroupAdminAnimeController::class,'edit'])->name('animes.edit');
            Route::post('/admin/animes/{anime}/update',[GroupAdminAnimeController::class,'update'])->name('animes.update');
            Route::post('/admin/animes/{anime}/delete',[GroupAdminAnimeController::class,'delete'])->name('animes.delete');
            Route::post('/admin/animes/store',[GroupAdminAnimeController::class,'store'])->name('animes.store');
            Route::get('/admin/animes/{anime}/episodes/create',[GroupAdminAnimeController::class,'episodeCreate'])->name('animes.episodes.create');
            Route::post('/admin/animes/{anime}/episodes/store',[GroupAdminAnimeController::class,'episodeStore'])->name('animes.episodes.store');
            Route::get('/admin/animes/{anime}/episodes/{episode}/edit',[GroupAdminAnimeController::class,'editEpisode'])->name('animes.episodes.edit');
            Route::post('/admin/animes/{anime}/episodes/{episode}/update',[GroupAdminAnimeController::class,'updateEpisode'])->name('animes.episodes.update');
            Route::post('/admin/animes/{anime}/episodes/{episode}/delete',[GroupAdminAnimeController::class,'delegdgbvteEpisode'])->name('animes.episodes.delete');
            // Manga Route
            Route::get('/admin/mangas',[GroupAdminMangaController::class,'index'])->name("mangas");
            Route::get('/admin/mangas/create',[GroupAdminMangaController::class,'create'])->name('mangas.create');
            Route::post('/admin/mangas/store',[GroupAdminMangaController::class,'store'])->name('mangas.store');
            Route::get('/admin/mangas/{manga}/edit',[GroupAdminMangaController::class,'edit'])->name('mangas.edit');
            Route::post('/admin/mangas/{manga}/update',[GroupAdminMangaController::class,'update'])->name("mangas.update");
            Route::post('/admin/mangas/delete',[GroupAdminMangaController::class,'delete'])->name('mangas.delete');
            Route::get('/admin/mangas/{manga}/chapters/create',[GroupAdminMangaController::class,'chapterCreate'])->name('mangas.chapters.create');
            Route::post('/admin/mangas/{manga}/chapters/store',[GroupAdminMangaController::class,'chapterStore'])->name('mangas.chapters.store');
            Route::get('/admin/mangas/{manga}/chapters/{chapter}/edit',[GroupAdminMangaController::class,'editChapter'])->name('mangas.chapters.edit');
            Route::post('/admin/mangas/{manga}/chapters/{chapter}/update',[GroupAdminMangaController::class,'updateChapter'])->name('mangas.chapters.update');
            Route::post('/admin/mangas/{manga}/chapters/{chapter}/delete',[GroupAdminMangaController::class,'deleteChapter'])->name('mangas.chapters.delete');
            // Comment Route
            Route::get('/admin/comments',[GroupAdminCommentController::class,'index'])->name('comments');
            Route::post('/admin/comments/{comment}/delete',[GroupAdminCommentController::class,'delete'])->name('comments.delete');
        });
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
