<?php

namespace App\Dtos\Admin;

use RequestUtils;
use App\Dtos\RequestDTO;
use Illuminate\Http\Request;

class AdminLoginDTO extends RequestDTO
{
    /** @var string */
    public $userAgant;

    /** @var string */
    public $ip;

    public function __construct(public string $username, public string $password) {
        
    }

    public static function fromRequest(Request $request, bool $removeNullField = true)
    {
        
        $obj = parent::fromRequest($request, $removeNullField);
        if ($obj instanceof self) {
            $obj->userAgant = $request->header('User-Agent');
            $obj->ip = RequestUtils::getClientIp();
        }
        return $obj;
    }
}

