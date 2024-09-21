<?php

namespace App\Services\Admin;

use Carbon\Carbon;
use App\Models\Admin;
use App\Common\AppError;
use App\Common\AppErrorType;
use App\Common\Enums\AdminRole;
use App\Dtos\Admin\AdminLoginDTO;
use Illuminate\Support\Facades\Hash;

class AdminService {
    public function __construct() {
        
    }


    public function login(AdminLoginDTO $adminLoginDTO, AdminRole $acceptRole) {
        /** @var Admin */
        $admin = Admin::where('username', $adminLoginDTO->username)->first();
        if (!$admin) {
            return AppError::newNotFound(AppErrorType::ADMIN_NOT_FOUND);
        }

        $error = null;
        if (!Hash::check($adminLoginDTO->password, $admin->password)) {
            $error = AppError::new(AppErrorType::ADMIN_INVALID_USER_OR_PASSWORD);
        }

        if ($admin->role !== $acceptRole) {
            $error = AppError::new(AppErrorType::ADMIN_INVALID_USER_OR_PASSWORD);
        }

        if ($error) {
            return $error;
        }

        $admin->loggedin_at = Carbon::now();
        $admin->save();

        return $admin;
    }
}