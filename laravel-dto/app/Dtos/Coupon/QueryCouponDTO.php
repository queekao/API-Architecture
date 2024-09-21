<?php

namespace App\Dtos\Coupon;

use App\Dtos\RequestDTO;
use Spatie\LaravelData\Attributes\Validation\In;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;


class QueryCouponDTO extends RequestDTO
{
    public function __construct(
        #[Max(100)]
        public? string $category,
        #[Max(100)]
        public? string $search_title,
        #[Max(100)]
        public? string $search_description,
        #[In('sid', 'category', 'title', 'description', 'status', 'redeemed_time_rage')]
        public? string $order_by = 'id',
        #[In('asc', 'desc')]
        public? string $order_type = 'asc',
        #[Min(1)]
        public? int $page_size = 10,
        #[Min(1)]
        public? int $page_num = 1,
    ) {
        
    }
}

