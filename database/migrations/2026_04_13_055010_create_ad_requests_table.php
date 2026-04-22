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
        Schema::create('ad_requests', function (Blueprint $table) {
            $table->id();
            $table->string("name");
            $table->string("phone");
            $table->string("email");
            $table->string("address");
            $table->string("website")->nullable();
            $table->timestamp("from")->nullable();
            $table->timestamp("to")->nullable();
            $table->string("size")->default("600x600"); //600x600
            $table->string("type")->default("image"); //video
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ad_requests');
    }
};
