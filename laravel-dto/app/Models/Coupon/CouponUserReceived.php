<?php

namespace App\Models\Coupon;

use DateTimeFormatUtils;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class CouponUserReceived extends Model {

    protected $table = 'coupon_user_receiveds';

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'redeemed_at'         => DateTimeFormatUtils::UTC,
        'created_at'          => DateTimeFormatUtils::UTC,
        'updated_at'          => DateTimeFormatUtils::UTC,
    ];

    public function belongCoupon() {
        return $this->belongsTo(Coupon::class, 'coupon_id', 'id');
    }

    public function belongCouponRedeemCode() {
        return $this->belongsTo(CouponRedeemCode::class, 'coupon_redeem_code_id', 'id');
    }

    public function belongUser() {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}