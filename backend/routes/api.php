<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\FoodController;
use App\Http\Controllers\ClientController;



    //filter by Bar_Code
    Route::get('/foods/barcode/{barcode}', [FoodController::class, 'filterByBarcode']);


Route::prefix('admin')->group(function () {
    Route::post('login', [AdminController::class, 'login']);
    Route::middleware('auth:sanctum')->group(function () {
    Route::get('/users', [AdminController::class, 'clientList']);      
    Route::delete('/users/{id}', [AdminController::class, 'clientdestroy']); 
    Route::get('dashboard', [AdminController::class, 'dashboard']);
    Route::post('logout', [AdminController::class, 'logout']);
    Route::get('/favorites', [AdminController::class, 'allFavorites']);
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

//client
Route::post('/client/register', [ClientController::class, 'register']);
Route::post('/client/login', [ClientController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/client/dashboard', [ClientController::class, 'dashboard']);
    Route::post('/client/favorite/toggle', [ClientController::class, 'toggleFavorite']);
    Route::get('/client/favorites', [ClientController::class, 'favorites']);
    Route::get('/client/profile', [ClientController::class, 'profile']);
    Route::post('/client/logout', [ClientController::class, 'logout']);
    Route::get('/foods', [FoodController::class, 'index']);    
});




