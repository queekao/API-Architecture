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
        Schema::create('coupon_redeem_codes', function (Blueprint $table) {
            $table->id();

            $table->string('sid')->unique()->index();

            $table->bigInteger('coupon_id')->unsigned()->index();
            $table->foreign('coupon_id')->references('id')->on('coupons')->onDelete('cascade');

            // 兌換碼
            $table->string('redeem_code')->unique();

            $table->integer('total_nums')->unsigned();
            $table->integer('redeemed_nums')->unsigned();

            // 單個使用者最多可兌換次數
            $table->integer('per_user_redeem_times')->unsigned()->default(1);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coupon_redeem_codes');
    }
};
