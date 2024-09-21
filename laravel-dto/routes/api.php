<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

if (config('app.debug.route') === true) {
    Route::get('/csrf', function (Request $request) {
        return response()->json(['csrf' => 'csrf_token()']);
    })->middleware(['middleware' => 'web']);
}

