<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;
use App\Http\Controllers\ApiController;
use App\Http\Controllers\SitemapController;

Route::get('/setup-database', function () {
    try {
        Artisan::call('migrate:fresh', ['--force' => true]);
        Artisan::call('db:seed', ['--force' => true]);
        Artisan::call('storage:link');
        Artisan::call('config:cache');
        return response()->json(['message' => 'Database fully migrated and seeded!']);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});

// Public routes
Route::get('/products', [ApiController::class, 'getProducts']);
Route::get('/products/{slug}', [ApiController::class, 'getProduct']);
Route::get('/categories', [ApiController::class, 'getCategories']);
Route::get('/categories/{slug}', [ApiController::class, 'getCategory']);
Route::post('/orders', [ApiController::class, 'createOrder']);
Route::get('/orders/{id}', [ApiController::class, 'getOrderById']); // Used for tracking

// Auth
Route::post('/auth/register', [ApiController::class, 'register']);
Route::post('/auth/login', [ApiController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [ApiController::class, 'me']);
    Route::post('/auth/logout', [ApiController::class, 'logout']);
    Route::get('/user/orders', [ApiController::class, 'getOrders']);
});

// Sitemap — secured by SITEMAP_KEY env variable (no auth middleware needed)
Route::get('/generate-sitemap/{key}', [SitemapController::class, 'generate']);
