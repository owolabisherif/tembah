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
        Schema::create('players', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("player_id")->unique();
            $table->unsignedBigInteger("team_id")->unique();
            $table->unsignedBigInteger("national_team_id")->unique();
            $table->string("name");
            $table->string("common_name");
            $table->string("firstname");
            $table->string("lastname");
            $table->string("nationality");
            $table->string("team");
            $table->date("birthdate")->nullable();
            $table->string("age");
            $table->string("birth_country");
            $table->string("birth_place");
            $table->string("position");
            $table->string("height");
            $table->string("weight");
            $table->string("preferred_foot");
            $table->string("market_value");
            $table->string("image")->nullable();
            $table->json("statistics")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('players');
    }
};
