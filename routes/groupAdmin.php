

<?php

use App\Http\Controllers\GroupAdminUserController;
use App\Http\Controllers\GroupAdminSubscriberController;
use App\Http\Controllers\GroupAdminAnimeController;
use App\Http\Controllers\GroupAdminMangaController;
use App\Http\Controllers\GroupAdminCommentController;
use App\Http\Controllers\GroupAdminTagController;
use App\Http\Controllers\GroupAdminSettingController;
use App\Http\Controllers\GroupAdminSeasonController;
use App\Http\Controllers\GroupAdminBannerController;
use App\Http\Controllers\DashboardController;
use App\Http\Middleware\SubscriptionMiddleware;
use Illuminate\Support\Facades\Route;

Route::name('admin.')->middleware(['auth', 'admin', SubscriptionMiddleware::class])->group(function () {
    Route::get('/admin/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    //User Routes
    Route::get('/admin/users', [GroupAdminUserController::class, 'index'])->name('users');
    Route::get('/admin/users/create', [GroupAdminUserController::class, 'create'])->name('create');
    Route::post('/admin/users/store', [GroupAdminUserController::class, 'store'])->name('users.store');
    Route::get('/admin/users/{user}/edit', [GroupAdminUserController::class, 'edit'])->name('users.edit');
    Route::post('/admin/users/{user}/update', [GroupAdminUserController::class, 'update'])->name('users.update');
    Route::post('/admin/users/{user}/delete', [GroupAdminUserController::class, 'delete'])->name('users.delete');
    // Subscriber Routes
    Route::get('/admin/subscribers', [GroupAdminSubscriberController::class, 'index'])->name('subscribers');
    Route::get('/admin/subscribers/{subscriber}/edit', [GroupAdminSubscriberController::class, 'edit'])->name('subscribers.edit');
    Route::post('/admin/subscribers/{subscriber}/update', [GroupAdminSubscriberController::class, 'update'])->name('subscribers.update');
    Route::post('/admin/subscribers/{subscriber}/delete', [GroupAdminSubscriberController::class, 'delete'])->name('subscribers.delete');
    // Anime Routes
    Route::get('/admin/animes', [GroupAdminAnimeController::class, 'index'])->name('animes');
    Route::get('/admin/animes/create', [GroupAdminAnimeController::class, 'create'])->name('animes.create');
    Route::get('/admin/animes/{anime}/edit', [GroupAdminAnimeController::class, 'edit'])->name('animes.edit');
    Route::post('/admin/animes/{anime}/update', [GroupAdminAnimeController::class, 'update'])->name('animes.update');
    Route::post('/admin/animes/{anime}/delete', [GroupAdminAnimeController::class, 'delete'])->name('animes.delete');
    Route::post('/admin/animes/store', [GroupAdminAnimeController::class, 'store'])->name('animes.store');
    Route::get('/admin/animes/{anime}/episodes/create', [GroupAdminAnimeController::class, 'episodeCreate'])->name('animes.episodes.create');
    Route::post('/admin/animes/{anime}/episodes/store', [GroupAdminAnimeController::class, 'episodeStore'])->name('animes.episodes.store');
    Route::get('/admin/animes/{anime}/episodes/{episode}/edit', [GroupAdminAnimeController::class, 'editEpisode'])->name('animes.episodes.edit');
    Route::post('/admin/animes/{anime}/episodes/{episode}/update', [GroupAdminAnimeController::class, 'updateEpisode'])->name('animes.episodes.update');
    Route::post('/admin/animes/{anime}/episodes/{episode}/delete', [GroupAdminAnimeController::class, 'deleteEpisode'])->name('animes.episodes.delete');
    // Manga Route
    Route::get('/admin/mangas', [GroupAdminMangaController::class, 'index'])->name("mangas");
    Route::get('/admin/mangas/create', [GroupAdminMangaController::class, 'create'])->name('mangas.create');
    Route::post('/admin/mangas/store', [GroupAdminMangaController::class, 'store'])->name('mangas.store');
    Route::get('/admin/mangas/{manga}/edit', [GroupAdminMangaController::class, 'edit'])->name('mangas.edit');
    Route::post('/admin/mangas/{manga}/update', [GroupAdminMangaController::class, 'update'])->name("mangas.update");
    Route::post('/admin/mangas/delete', [GroupAdminMangaController::class, 'delete'])->name('mangas.delete');
    Route::get('/admin/mangas/{manga}/chapters/create', [GroupAdminMangaController::class, 'chapterCreate'])->name('mangas.chapters.create');
    Route::post('/admin/mangas/{manga}/chapters/store', [GroupAdminMangaController::class, 'chapterStore'])->name('mangas.chapters.store');
    Route::get('/admin/mangas/{manga}/chapters/{chapter}/edit', [GroupAdminMangaController::class, 'editChapter'])->name('mangas.chapters.edit');
    Route::post('/admin/mangas/{manga}/chapters/{chapter}/update', [GroupAdminMangaController::class, 'updateChapter'])->name('mangas.chapters.update');
    Route::post('/admin/mangas/{manga}/chapters/{chapter}/delete', [GroupAdminMangaController::class, 'deleteChapter'])->name('mangas.chapters.delete');
    // Comment Route
    Route::get('/admin/comments', [GroupAdminCommentController::class, 'index'])->name('comments');
    Route::post('/admin/comments/{comment}/delete', [GroupAdminCommentController::class, 'delete'])->name('comments.delete');
    //Tag Routes
    Route::get('/admin/tags', [GroupAdminTagController::class, 'index'])->name('tags');
    Route::get('/admin/tags/create', [GroupAdminTagController::class, 'create'])->name('tags.create');
    Route::post('/admin/tags/store', [GroupAdminTagController::class, 'store'])->name('tags.store');
    Route::get('/admin/tags/{tag}/edit', [GroupAdminTagController::class, 'edit'])->name('tags.edit');
    Route::post('/admin/tags/{tag}/update', [GroupAdminTagController::class, 'update'])->name('tags.update');
    Route::post('/admin/tags/{tag}/delete', [GroupAdminTagController::class, 'delete'])->name('tags.delete');
    //Setting Routes
    Route::get('/admin/setting', [GroupAdminSettingController::class, 'index'])->name('setting');
    //Group Data Routes
    Route::post('/admin/setting/{setting}/update', [GroupAdminSettingController::class, 'update'])->name('setting.update');
    //Ouo Fail Links

    // Season Routes
    Route::get('/admin/animes/{anime:slug}/seasons/create', [GroupAdminSeasonController::class, 'animeSeasonCreate'])->name('anime.seasons.create');
    Route::post('/admin/seasons/store', [GroupAdminSeasonController::class, 'store'])->name('seasons.store');
    Route::get('/admin/animes/{anime:slug}/seasons/{season}/edit', [GroupAdminSeasonController::class, 'animeSeasonEdit'])->name('anime.seasons.edit');
    Route::post('/admin/seasons/{season}/update', [GroupAdminSeasonController::class, 'seasonUpdate'])->name('seasons.update');
    Route::post('/admin/seasons/{season}/delete', [GroupAdminSeasonController::class, 'delete'])->name('seasons.delete');

    Route::get('/admin/mangas/{manga:slug}/seasons/create', [GroupAdminSeasonController::class, 'mangaSeasonCreate'])->name('manga.seasons.create');
    Route::get('/admin/mangas/{manga:slug}/seasons/{season}/edit', [GroupAdminSeasonController::class, 'mangaSeasonEdit'])->name('manga.seasons.edit');


    //Banners
    Route::get('/admin/banners', [GroupAdminBannerController::class, 'index'])->name('banners');
    Route::post('/admin/banners/update', [GroupAdminBannerController::class, 'update'])->name('banners.update');
});
