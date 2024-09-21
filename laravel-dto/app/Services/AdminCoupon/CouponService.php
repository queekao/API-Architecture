<?php

namespace App\Services\AdminCoupon;

use App\Common\AppError;
use App\Common\AppErrorType;
use App\Dtos\Coupon\QueryCouponDTO;
use App\Dtos\Coupon\UpdateCouponDTO;
use App\Models\Coupon\Coupon;
use Carbon\Carbon;

class CouponService
{
    public function __construct()
    {
        //
    }

    public function createNewCoupon()
    {
        $newCoupon = Coupon::createNewCoupon();
        return $newCoupon;
    }

    public function updateCoupon(string|int $couponId, UpdateCouponDTO $data) {
        $coupon = Coupon::findBySid($couponId);
        if (!$coupon) {
            return AppError::new(AppErrorType::COUPON_NOT_FOUND);
        }
    
        $coupon->category          = $data->category;
        $coupon->title             = $data->title;
        $coupon->description       = $data->description;
        $coupon->total_nums        = $data->total_nums;
        $coupon->status            = $data->status;
        $coupon->redeemed_start_at = $data->redeemed_start_at;
        $coupon->redeemed_end_at   = $data->redeemed_end_at;
        $coupon->save();

        return $coupon;
    }

    public function findCoupon(string|int $couponId) {
        $coupon = Coupon::findBySid($couponId);
        if (!$coupon) {
            return AppError::new(AppErrorType::COUPON_NOT_FOUND);
        }

        return $coupon;
    }


    public function queryCoupon(QueryCouponDTO $data) {
        $couponQuery = Coupon::query();

        if ($data->category) {
            $couponQuery->where('category', $data->category);
        }

        if ($data->search_title) {
            $couponQuery->where('title', 'like', "%{$data->search_title}%");
        }

        if ($data->search_description) {
            $couponQuery->where('description', 'like', "%{$data->search_description}%");
        }

        if ($data->order_by) {
            if ($data->order_by === 'redeemed_time_rage') {
                $couponQuery->orderBy('redeemed_start_at')
                            ->orderBy('redeemed_end_at');
            }
            else {
                $couponQuery->orderBy($data->order_by, $data->order_type);
            }
        }

        $couponQuery
            ->offset(($data->page_num - 1) * $data->page_size)
            ->limit($data->page_size);

        return [
            'total'     => $couponQuery->count(),
            'page_size' => $data->page_size,
            'page_num'  => $data->page_num,
            'rows'      => $couponQuery->get(),
        ];
    }
}

