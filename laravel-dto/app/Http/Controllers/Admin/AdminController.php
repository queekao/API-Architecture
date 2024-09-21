<?php

namespace App\Http\Controllers\Admin;

use App\Common\AppError;
use App\Common\AppResponse;
use App\Common\Enums\AdminRole;
use App\Dtos\Admin\AdminLoginDTO;
use App\Http\Controllers\Controller;
use App\Services\Admin\AdminService;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function __construct(public AdminService $adminService) {

    }

    public function login(Request $request) {
        $adminLoginDTO = AdminLoginDTO::fromRequest($request);
        if ($adminLoginDTO instanceof AppError) {
            return $adminLoginDTO->toHttpResponse();
        }

        $adminResult = $this->adminService->login($adminLoginDTO, AdminRole::SuperAdmin);
        if ($adminResult instanceof AppError) {
            return $adminResult->toHttpResponse();
        }

        $request->session()->put('admin_id', $adminResult->id);

        return AppResponse::wrapWithData($adminResult);
    }
}
