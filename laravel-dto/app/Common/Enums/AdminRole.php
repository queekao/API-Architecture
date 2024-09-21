<?php

namespace App\Common\Enums;

use App\Common\Attributes\BaseEnumTrait;

enum AdminRole: string
{
    use BaseEnumTrait;

    case SuperAdmin = 'super_admin';
}
