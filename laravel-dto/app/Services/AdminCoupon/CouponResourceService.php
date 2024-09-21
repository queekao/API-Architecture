<?php

namespace App\Services\AdminCoupon;

use Storage;
use ExceptionLogUtils;
use App\Common\AppError;
use App\Common\AppErrorType;
use App\Models\Coupon\Coupon;
use Illuminate\Http\UploadedFile;

class CouponResourceService
{
    /** @var string */
    private $BANNER_SOTRE_TYPE = 'local';
    /** @var string */
    private $BANNER_SOTRE_PATH = 'banner';

    public function __construct()
    {
        $this->BANNER_SOTRE_TYPE = config('coupon.banner.store_type');
        $this->BANNER_SOTRE_PATH = config('coupon.banner.store_path');
    }

    
    public function saveBanner(string $couponSid, UploadedFile $file) {

        $coupon = Coupon::findBySid($couponSid);
        if (!$coupon) {
            return AppError::new(AppErrorType::COUPON_NOT_FOUND);
        }

        // 刪除舊的 banner
        try {
            if ($this->BANNER_SOTRE_TYPE === 'local') {
                Storage::disk('resources')->delete($coupon->banner_url);
            }
            else {
                // maybe s3 or something else
                return AppError::new(AppErrorType::COUPON_BANNEER_UPLOAD_FAILED);
            }
        }
        catch (\Exception $e) {
            ExceptionLogUtils::logException($e, "Delete banner failed");
            return AppError::new(AppErrorType::COUPON_BANNEER_UPLOAD_FAILED);
        }

        // 建立新的 banner
        $fileName = 'banner-'.$couponSid.'.'.$file->getClientOriginalExtension();
        try {
            if ($this->BANNER_SOTRE_TYPE === 'local') {
                $filePath = 'coupon/'.$couponSid.'/'.$this->BANNER_SOTRE_PATH.'/'.$fileName;
                Storage::disk('resources')->put($filePath, $file->get());    
                return $filePath;
            }
            else {
                // maybe s3 or something else
                return AppError::new(AppErrorType::COUPON_BANNEER_UPLOAD_FAILED);
            }
        }
        catch (\Exception $e) {
            ExceptionLogUtils::logException($e, "Upload banner failed");
            return AppError::new(AppErrorType::COUPON_BANNEER_UPLOAD_FAILED);
        }
    }
}
