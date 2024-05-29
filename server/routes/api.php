<?php

use App\Http\Controllers\BookController;
use Illuminate\Http\Request;

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

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

// Route::get('/books', 'BookController@index');
// Route::post('/books/create', 'BookController@store');
// Route::put('/books/update', 'BookController@store');
// Route::get('/books/create', 'BookController@store');
// Route::post('/books/create', 'BookController@store');

Route::prefix('books')->group(function () {
    Route::get('/', 'BookController@index');
    Route::post('/', 'BookController@store');
    Route::get('/{id}', 'BookController@show');
    Route::put('/{id}', 'BookController@update');
    Route::delete('/{id}', 'BookController@destroy');
});
