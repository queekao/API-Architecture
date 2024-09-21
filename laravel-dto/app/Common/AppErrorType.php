<?php

namespace App\Common;

use App\Common\Attributes\Error;
use App\Common\Attributes\ErrorEunmTrait;

/**
 * @method int code()
 * @method string message() */
enum AppErrorType {
    use ErrorEunmTrait;

    #[Error(0, 'No Error')]
    case NO_ERROR;

    #[Error(301, 'Invalid request format')]
    case INVALID_REQUEST_FORMAT;
    

    // ------------------------------------------------------
    // Coupon 相關錯誤
    #[Error(1001, 'Coupon not found')]
    case COUPON_NOT_FOUND;
    #[Error(1002, 'Coupon update status invalid')]
    case COUPON_UPDATE_STATUS_INVALID;
    #[Error(1003, 'Coupon banner upload failed')]
    case COUPON_BANNEER_UPLOAD_FAILED;

    // ------------------------------------------------------
    // 權限
    #[Error(1101, 'authorized token failed')]
    case UNAUTHORIZED_TOKEN;

    // Admin 相關錯誤
    #[Error(1201, 'Admin not found')]
    case ADMIN_NOT_FOUND;
    #[Error(1202, 'Admin permission denied')]
    case ADMIN_PERMISSION_DENIED;

    #[Error(1203, 'This account is inactive')]
    case ADMIN_ACCOUNT_IS_INACTIVE;

    #[Error(1204, 'Invalid permission role')]
    case ADMIN_INVALID_ROLE;

    #[Error(1205, 'Invalid passwowrd')]
    case ADMIN_INVALID_USER_OR_PASSWORD;
}
