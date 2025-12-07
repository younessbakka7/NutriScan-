<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;

Route::prefix('admin')->group(function () {
    Route::post('login', [AdminController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
    Route::get('dashboard', [AdminController::class, 'index']);
    Route::post('logout', [AdminController::class, 'logout']);
});



});
