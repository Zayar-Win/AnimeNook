<?php

use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\AdminGroupController;
use App\Http\Controllers\AdminOuoFailLinkController;
use App\Http\Controllers\AdminUserController;
use Illuminate\Support\Facades\Route;

Route::name('admin.')->group(function () {
    Route::get('/admin/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::get('/admin/users', [AdminUserController::class, 'index'])->name('users');
    Route::get('/admin/users/create', [AdminUserController::class, 'create'])->name('users.create');
    Route::post('/admin/users/store', [AdminUserController::class, 'store'])->name('users.store');
    Route::get('/admin/users/{user}/edit', [AdminUserController::class, 'edit'])->name('users.edit');
    Route::post('/admin/users/{user}/update', [AdminUserController::class, 'update'])->name('users.update');
    Route::post('/admin/users/{user}/delete', [AdminUserController::class, 'delete'])->name('users.delete');
    //Group Routes
    Route::get('/admin/groups', [AdminGroupController::class, 'index'])->name('groups');
    Route::get('/admin/groups/create', [AdminGroupController::class, 'create'])->name('groups.create');
    Route::post('/admin/groups/store', [AdminGroupController::class, 'store'])->name('groups.store');
    Route::get('/admin/groups/{group}/edit', [AdminGroupController::class, 'edit'])->name('groups.edit');
    Route::post('/admin/groups/{group}/update', [AdminGroupController::class, 'update'])->name('groups.update');
    Route::post('/admin/groups/{group}/delete', [AdminGroupController::class, 'delete'])->name('groups.delete');
    Route::post('/admin/groups/{group}/updateSubscription', [AdminGroupController::class, 'updateSubscription'])->name('groups.updateSubscription');
    //Ouo fail Links
    Route::get('/admin/ouofaillinks', [AdminOuoFailLinkController::class, 'index'])->name('ouo.fail.links');
    Route::post('/admin/ouofaillinks/{failLink}/delete', [AdminOuoFailLinkController::class, 'delete'])->name('ouo.fail.links.delete');
    Route::post('/admin/ouofaillinks/{failLink}/rerun', [AdminOuoFailLinkController::class, 'rerunFailLink'])->name('ouo.fail.links.rerun');
    Route::post('/admin/ouofaillinks/rerun', [AdminOuoFailLinkController::class, 'rerunAllFailLink'])->name('ouo.fail.links.rerunAll');
});
