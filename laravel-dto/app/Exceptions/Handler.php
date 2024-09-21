<?php

namespace App\Exceptions;

use Throwable;
use ExceptionLogUtils;
use App\Common\AppError;
use App\Common\AppErrorType;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Auth\AuthenticationException;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    public function unauthenticated($request, AuthenticationException $exception)
    {
        
        return AppError::new(AppErrorType::UNAUTHORIZED_TOKEN)->toHttpResponse();
    }

    public function report(Throwable $e)
    {
        ExceptionLogUtils::logException($e);
        parent::report($e);
    }

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            ExceptionLogUtils::logException($e);
        });
    }
}
