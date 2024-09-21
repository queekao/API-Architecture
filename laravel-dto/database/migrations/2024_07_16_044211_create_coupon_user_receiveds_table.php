<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('coupon_user_receiveds', function (Blueprint $table) {
            $table->id();

            $table->string('sid')->unique()->index();

            
            $table->bigInteger('user_id')->unsigned()->index();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            $table->bigInteger('coupon_id')->unsigned()->index();
            $table->foreign('coupon_id')->references('id')->on('coupons')->onDelete('cascade');

            $table->bigInteger('coupon_redeem_code_id')->nullable()->unsigned()->index();
            $table->foreign('coupon_redeem_code_id')->references('id')->on('coupon_redeem_codes')->onDelete('cascade');

            $table->datetime('redeemed_at');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coupon_user_receiveds');
    }
};
