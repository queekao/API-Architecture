<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\AdminCoupon\CouponController as AdminCouponController;
use App\Http\Controllers\RootController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::prefix('wapi')
    ->group(function () {

        Route::prefix('admin')
            ->group(function () {
                Route::post('login', [AdminController::class, 'login']);
            });

        Route::prefix('coupon')
            ->group(function () {
                Route::get('query', [AdminCouponController::class, 'queryCoupon']);
                Route::post('create', [AdminCouponController::class, 'createNewCoupon']);
                Route::get('/{couponId}', [AdminCouponController::class, 'findCoupon']);
                Route::post('/{couponId}/update', [AdminCouponController::class, 'updateCoupon']);
                Route::post('/{couponId}/upload-banner', [AdminCouponController::class, 'uploadBanner']);
            });

    });


Route::get('/{path?}', [RootController::class, 'show'])->where('path', '^(?!api).*');
