<?php

namespace App\Models\Coupon;

use DateTimeFormatUtils;
use Illuminate\Database\Eloquent\Model;

class CouponRedeemCode extends Model {

    protected $table = 'coupon_redeem_codes';

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'created_at'          => DateTimeFormatUtils::UTC,
        'updated_at'          => DateTimeFormatUtils::UTC,
    ];

    public function belongCoupon() {
        return $this->belongsTo(Coupon::class, 'coupon_id', 'id');
    }
}