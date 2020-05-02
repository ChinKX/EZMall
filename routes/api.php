<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::post('register', 'Auth\RegisterController@register');

Route::middleware('api')->namespace('Auth')->prefix('auth')->group(function() {
    Route::post('login', 'AuthController@login');
    Route::post('logout', 'AuthController@logout');
    Route::post('refresh', 'AuthController@refresh');
    Route::post('me', 'AuthController@me');
});

Route::middleware('jwt.auth')->group(function() {
    Route::get('countries', 'CountryController@index');
    Route::get('countries/{id}', 'CountryController@show');
    Route::post('countries', 'CountryController@store');
    Route::put('countries/{id}', 'CountryController@update');
    Route::delete('countries/{id}', 'CountryController@destroy');

    Route::get('orders', 'OrderController@index');
    Route::get('orders/{id}', 'OrderController@show');
    Route::post('orders', 'OrderController@store');
    Route::put('orders/{id}', 'OrderController@update');
    Route::delete('orders/{id}', 'OrderController@destroy');

    Route::get('stores', 'StoreController@index');
    Route::get('stores/{id}', 'StoreController@show');
    Route::post('stores', 'StoreController@store');
    Route::put('stores/{id}', 'StoreController@update');
    Route::delete('stores/{id}', 'StoreController@destroy');

    Route::get('products', 'ProductController@index');
    Route::get('products/{id}', 'ProductController@show');
    Route::post('products', 'ProductController@store');
    Route::put('products/{id}', 'ProductController@update');
    Route::delete('products/{id}', 'ProductController@destroy');
});