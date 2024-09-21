<?php

use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

if (!class_exists(RequestUtils::class)) {
    class RequestUtils {
        public static function getClientIp() {
            $clientIP = '';
            if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
                // To check ip is pass from proxy
                $clientIPs = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
                $clientIPs = array_map('trim', $clientIPs);
                $clientIP = end($clientIPs); // Get the last IP which create by load balancer, don't get the first, it may fake by client.
            }
            else {
                $clientIP = $_SERVER['REMOTE_ADDR'];
            }

            // Remove port part.
            $parts = explode(':', $clientIP);
            $clientIP = reset($parts);
            return $clientIP;
        }
    }
}

if (!class_exists(DateTimeFormatUtils::class)) {
    class DateTimeFormatUtils
    {
        public const UTC = 'datetime:Y-m-d\TH:i:s.v\Z';

        public static function currentTaiwanTime(string $format = 'Y-m-d H:i:s')
        {
            return Carbon::now('Asia/Taipei')->format($format);
        }
    }
}

if (!class_exists(ExceptionLogUtils::class)) {
    class ExceptionLogUtils
    {
        public static function logException(Throwable $e, string $message = '')
        {
            $taiwanTime = DateTimeFormatUtils::currentTaiwanTime();
            Log::channel('exception')->info("\n\n\n\n\n\n");
            Log::channel('exception')->info('====================================================================================================================================================================================================');
            Log::channel('exception')->info("=====================================================    TaiwanTime: [$taiwanTime]    =============================================================================================================");
            Log::channel('exception')->notice($message);
            Log::channel('exception')->critical($e);
        }
    }
}


if (!class_exists(StringUtils::class)) {
    class StringUtils {
        /** 產生 Random Hex
         *  @param int $num 產生的長度
         *  @return string hex string  */
        public static function randomHex(int $num = 4) {
            return bin2hex(openssl_random_pseudo_bytes($num));
        }

    }
}

if (!class_exists(AssetUtils::class)) {
    class AssetUtils {
        public static function assetUrl(string $path) {
            return secure_asset($path.'?ver='.config('app.version'));
        }
    
    }
}


