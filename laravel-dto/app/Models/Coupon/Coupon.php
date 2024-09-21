<?php

namespace App\Models\Coupon;

use StringUtils;
use DateTimeFormatUtils;
use Carbon\Carbon;
use App\Common\Enums\CouponStatus;
use Illuminate\Database\Eloquent\Model;

class Coupon extends Model {

    protected $table = 'coupons';

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'status'              => CouponStatus::class,
        'redeemed_start_at'   => DateTimeFormatUtils::UTC,
        'redeemed_end_at'     => DateTimeFormatUtils::UTC,
        'created_at'          => DateTimeFormatUtils::UTC,
        'updated_at'          => DateTimeFormatUtils::UTC,
    ];

    protected $hidden = [
        'id',
    ];

    public function redeemCodes() {
        return $this->hasMany(CouponRedeemCode::class, 'coupon_id', 'id');
    }

    public static function findBySid(string $sid): ?Coupon {
        return self::whereSid($sid)->first();
    }

    public static function createNewCoupon() {
        $newCoupon = new Coupon();
        $newCoupon->sid = StringUtils::randomHex(36);
        $newCoupon->category = '';
        $newCoupon->title = '';
        $newCoupon->description = '';
        $newCoupon->banner_url = '';
        $newCoupon->total_nums = 0;
        $newCoupon->redeemed_nums = 0;
        $newCoupon->status = CouponStatus::Draft;
        $newCoupon->redeemed_start_at = Carbon::now();
        $newCoupon->redeemed_end_at = Carbon::now()->addDays(7);
        $newCoupon->save();

        // 重新設定 Coupon 的 sid
        $newCoupon->sid = StringUtils::randomHex(12).'-'.$newCoupon->id;
        $newCoupon->save();

        return $newCoupon;
    }
}