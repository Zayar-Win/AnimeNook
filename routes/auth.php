<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Main-domain auth routes (Breeze compatibility)
|--------------------------------------------------------------------------
|
| Login and registration use the tenant Group/Login and Group/Register
| Inertia pages only. Password reset uses Group/ForgotPassword and
| Group/ResetPassword under the tenant prefix.
|
*/

Route::middleware('guest')->group(function () {
    Route::get('login', function () {
        return redirect()->route('group.login', [
            'group' => config('auth.default_group_subdomain'),
        ]);
    })->name('login');

    Route::get('register', function () {
        return redirect()->route('group.register', [
            'group' => config('auth.default_group_subdomain'),
        ]);
    })->name('register');

    Route::get('forgot-password', function () {
        return redirect()->route('group.password.request', [
            'group' => config('auth.default_group_subdomain'),
        ]);
    })->name('password.request');

    Route::post('forgot-password', [AuthController::class, 'sendPasswordResetLinkMainDomain'])
        ->name('password.email');

    Route::get('reset-password/{token}', [AuthController::class, 'showResetPasswordFormMainDomain'])
        ->name('password.reset');

    Route::post('reset-password', [AuthController::class, 'resetPasswordMainDomain'])
        ->name('password.store');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('verify-email', EmailVerificationPromptController::class)
        ->name('verification.notice');

    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');

    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
        ->name('password.confirm');

    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

    Route::put('password', [PasswordController::class, 'update'])->name('password.update');

    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');
});
