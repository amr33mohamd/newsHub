<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', 'App\Http\Controllers\Api\AuthController@register');
Route::post('/login', 'App\Http\Controllers\Api\AuthController@login');

// Public article browsing
Route::get('/articles', 'App\Http\Controllers\Api\ArticleController@index');
Route::get('/articles/search', 'App\Http\Controllers\Api\ArticleController@search');

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Authentication
    Route::post('/logout', 'App\Http\Controllers\Api\AuthController@logout');
    Route::get('/user', 'App\Http\Controllers\Api\AuthController@user');

    // Personalized features (must come before /articles/{id})
    Route::get('/articles/personalized', 'App\Http\Controllers\Api\ArticleController@personalized');

    // User Preferences
    Route::get('/preferences', 'App\Http\Controllers\Api\PreferenceController@show');
    Route::put('/preferences', 'App\Http\Controllers\Api\PreferenceController@update');
});

// Public article routes (parameterized routes must come after specific ones)
Route::get('/articles/{id}', 'App\Http\Controllers\Api\ArticleController@show');
Route::get('/sources', 'App\Http\Controllers\Api\SourceController@index');
Route::get('/categories', 'App\Http\Controllers\Api\CategoryController@index');
