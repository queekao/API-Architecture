<?php

namespace App\Dtos;

use App\Common\AppError;
use App\Common\AppErrorType;
use Spatie\LaravelData\Dto;
use Illuminate\Http\Request;
use Spatie\LaravelData\Concerns\TransformableData;
use Spatie\LaravelData\Contracts\TransformableData as TransformableDataContract;


class RequestDTO extends Dto implements TransformableDataContract
{
    use TransformableData;


    public static function fromRequest(Request $request, bool $removeNullField = true)
    {
        $payload = $removeNullField 
            ?  array_filter($request->all(), function ($value) {
                return !is_null($value);
            })
            : $request->all();
        try {
            self::validate($payload);
            return self::from($payload);
        }
        catch (\Exception $e) {
            return AppError::new(AppErrorType::INVALID_REQUEST_FORMAT, $e->getMessage());
        }
    }
}


