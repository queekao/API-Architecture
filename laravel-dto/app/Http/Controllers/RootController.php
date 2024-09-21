<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log; //test log

class RootController extends Controller
{
    public function show(Request $request)
    {
        return view('app', [
            'appUrl' => config('app.url'),
            'appTitle' => config('app.title'),
            'assetUrl' => rtrim(secure_asset('/'), '/'),
            'appTimeZone' => config('app.timezone'),
            'appVerison' => config('app.version'),
            'appDebugVconsole' => config('app.debug.vconsole'),
        ]);
    }
}
