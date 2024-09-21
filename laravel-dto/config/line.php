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
    'oa_url' => env('LINE_OA_URL'),


    'liff' => [
        'login_mock_enable' => env('LINE_LIFF_LOGIN_MOCKED_ENABLE'),

        'login_channel_id' => env('LINE_LOGIN_CHANNEL_ID'),

        'id' => env('LINE_LIFF_ID'),

        'url' => env('LINE_LIFF_URL'),
    ],

    'message' => [
        'channel_access_token' => env('LINE_MESSAGE_API_CHANNEL_ACCESS_TOKEN'),

        'channel_secret' => env('LINE_MESSAGE_API_CHANNEL_SECRET'),
    ],
];
