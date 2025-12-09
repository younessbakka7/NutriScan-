<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\FoodController;



Route::prefix('admin')->group(function () {
    Route::post('login', [AdminController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
    Route::get('dashboard', [AdminController::class, 'dashboard']);
    Route::post('logout', [AdminController::class, 'logout']);
});

// route FOOD


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/foods', [FoodController::class, 'index']);
    Route::post('/foods', [FoodController::class, 'store']);
    Route::get('/foods/{id}', [FoodController::class, 'show']);
    Route::put('/foods/{id}', [FoodController::class, 'update']);
    Route::delete('/foods/{id}', [FoodController::class, 'destroy']);
});


});
