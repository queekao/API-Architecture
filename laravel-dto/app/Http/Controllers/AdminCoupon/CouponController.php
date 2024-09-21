<?php

namespace App\Http\Controllers\AdminCoupon;

use App\Common\AppError;
use App\Common\AppErrorType;
use App\Common\AppResponse;
use App\Dtos\Coupon\QueryCouponDTO;
use App\Dtos\Coupon\UpdateCouponDTO;
use App\Http\Controllers\Controller;
use App\Services\AdminCoupon\CouponResourceService as AdminCouponCouponResourceService;
use App\Services\AdminCoupon\CouponService as AdminCouponCouponService;
use Illuminate\Http\Request;

class CouponController extends Controller {

    public function __construct(
        public AdminCouponCouponService $adminCouponCouponService,
        public AdminCouponCouponResourceService $adminCouponResourceService
    ) {
        // 
    }

    public function createNewCoupon() {
        $result = $this->adminCouponCouponService->createNewCoupon();
        if ($result instanceof AppError) {
            return $result->toHttpResponse();
        }

        return AppResponse::wrapWithData($result);
    }

    public function uploadBanner(Request $request, string|int $couponId) {
        $bannerFile = $request->file('banner');
        if (!$bannerFile) {
            return AppError::new(AppErrorType::COUPON_BANNEER_UPLOAD_FAILED)->toHttpResponse();
        }

        $result = $this->adminCouponResourceService->saveBanner($couponId, $bannerFile);
        if ($result instanceof AppError) {
            return $result->toHttpResponse();
        }

        return AppResponse::wrapWithData(['banner_url' => $result]);
    }

    public function updateCoupon(Request $request, string|int $couponId) {
        $data = UpdateCouponDTO::fromRequest($request);
        if ($data instanceof AppError) {
            return $data->toHttpResponse();
        }

        $result = $this->adminCouponCouponService->updateCoupon($couponId, $data);
        if ($result instanceof AppError) {
            return $result->toHttpResponse();
        }

        return AppResponse::wrapWithData($result);
    }

    public function findCoupon(string|int $couponId) {
        $result = $this->adminCouponCouponService->findCoupon($couponId);
        if ($result instanceof AppError) {
            return $result->toHttpResponse();
        }

        return AppResponse::wrapWithData($result);
    }

    public function queryCoupon(Request $request) {
        $query = QueryCouponDTO::fromRequest($request);
        if ($query instanceof AppError) {
            return $query->toHttpResponse();
        }

        $result = $this->adminCouponCouponService->queryCoupon($query);
        if ($result instanceof AppError) {
            return $result->toHttpResponse();
        }

        return AppResponse::wrapWithData($result);
    }
}