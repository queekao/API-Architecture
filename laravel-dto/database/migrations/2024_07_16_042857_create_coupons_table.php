<?php

use App\Common\Enums\CouponStatus;
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
        Schema::create('coupons', function (Blueprint $table) {
            $table->id();
            $table->string('sid')->unique()->index();
            
            // Basic information
            $table->string('category');
            $table->string('title');
            $table->string('description');
            $table->string('banner_url');
            
            $table->integer('total_nums')->unsigned();
            $table->integer('redeemed_nums')->unsigned();

            $table->enum('status', CouponStatus::toValueArray())->default(CouponStatus::Draft);
            $table->datetime('redeemed_start_at');
            $table->datetime('redeemed_end_at');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coupons');
    }
};
