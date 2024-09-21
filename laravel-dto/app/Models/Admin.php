<?php

namespace App\Models;

use DateTimeFormatUtils;
use App\Common\Enums\AdminRole;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\HasApiTokens;

class Admin extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'username',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'password' => 'hashed',
        'role' => AdminRole::class,
        'created_at' => DateTimeFormatUtils::UTC,
        'updated_at' => DateTimeFormatUtils::UTC,
    ];

    public static function createNewAdmin(string $username, string $password, string $role)
    {
        $admin = new Admin;
        $admin->username = $username;
        $admin->password = Hash::make($password);
        $admin->role     = $role;
        $admin->active   = true;
        $admin->save();
        return $admin;
    }
}
