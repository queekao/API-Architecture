<?php

namespace App\Common\Enums;

use App\Common\Attributes\BaseEnumTrait;

enum CouponStatus: string
{
    use BaseEnumTrait;

    case Draft = 'draft';
    case Offline = 'offline';
    case Online = 'online';
}
