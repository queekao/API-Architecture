<?php

return [

    /*
    |--------------------------------------------------------------------------
    | View Storage Paths
    |--------------------------------------------------------------------------
    |
    | Most templating systems load templates from disk. Here you may specify
    | an array of paths that should be checked for your views. Of course
    | the usual Laravel view path has already been registered for you.
    |
    */
    'banner' => [
        'store_type' => env('COUPON_BANNER_SOTRE_TYPE', 'local'),
        'store_path' => env('COUPON_BANNER_SOTRE_PATH', 'banner'),
    ],
];
