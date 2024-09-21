<?php

namespace App\Dtos\Coupon;

use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Dtos\RequestDTO;
use App\Common\Enums\CouponStatus;
use Spatie\LaravelData\Attributes\Validation\DateFormat;
use Spatie\LaravelData\Attributes\Validation\Enum;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Regex;
use Spatie\LaravelData\Attributes\Validation\StartsWith;

/** @property Carbon redeemed_start_at
 *  @property Carbon redeemed_end_at */
class UpdateCouponDTO extends RequestDTO
{
    public function __construct(
        public string $category,

        public string $title,
    
        public string $description,

        #[StartsWith('coupon'), Regex('/[-|a-z0-9|\/]+(\/banner\/)[-|.|a-z0-9]+$/i')]
        public string $banner_url,
    
        #[Min(1)]
        public int $total_nums,
    
        #[Enum(CouponStatus::class)]
        public string $status,
    
        #[DateFormat('Y-m-d\TH:i:s.v\Z')]
        public string $redeemed_start_at,
    
        #[DateFormat('Y-m-d\TH:i:s.v\Z')]
        public string $redeemed_end_at,
    ) {

    }

    public static function fromRequest(Request $request, bool $removeNullField = true)
    {
        $obj = parent::fromRequest($request, $removeNullField);
        if ($obj instanceof self) {
            $obj->redeemed_start_at = Carbon::parse($obj->redeemed_start_at);
            $obj->redeemed_end_at = Carbon::parse($obj->redeemed_end_at);
        }
        return $obj;
    }
}

