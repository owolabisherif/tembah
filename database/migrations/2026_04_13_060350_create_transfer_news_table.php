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
        Schema::create('transfer_news', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("user_id")->index(); //posted by ?;
            $table->string("title");
            $table->string("title_ar");
            $table->longText("body");
            $table->longText("body_ar");
            $table->json("teams")->nullable();
            $table->json("leagues")->nullable();
            $table->json("players")->nullable();
            $table->boolean("status")->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transfer_news');
    }
};
