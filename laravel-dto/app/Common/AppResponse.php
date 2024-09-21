<?php

namespace App\Common;

class AppResponse {
    public static function wrapWithData(mixed $data) {
        return response()->json(['data' => $data]);
    } 
}
