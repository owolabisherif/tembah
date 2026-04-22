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
        Schema::create('teams', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("team_id");
            $table->unsignedBigInteger("venue_id")->nullable();
            $table->boolean("is_national_team")->default(false)->nullable();
            $table->boolean("is_women")->default(false)->nullable();
            $table->unsignedBigInteger("country_id")->nullable();
            $table->string("slug")->nullable();
            $table->string("slug_ar")->nullable();
            $table->string("name")->nullable();
            $table->string("name_ar")->nullable();
            $table->string("fullname")->nullable();
            $table->string("fullname_ar")->nullable();
            $table->string("founded")->nullable();
            $table->string("founded_ar")->nullable();
            $table->json("leagues")->nullable();
            $table->string("venue_name")->nullable();
            $table->string("venue_name_ar")->nullable();
            $table->string("venue_surface")->nullable();
            $table->json("venue_address")->nullable();
            $table->json("venue_city")->nullable();
            $table->string("venue_capacity")->nullable();
            $table->string("venue_capacity_ar")->nullable();
            $table->json("squad")->nullable();
            $table->json("coach")->nullable();
            $table->json("transfers")->nullable();
            $table->json("statistics")->nullable();
            $table->json("detailed_stats")->nullable();
            $table->json("sidelined")->nullable();
            $table->json("trophies")->nullable();
            $table->string("image")->nullable();
            $table->string("venue_image")->nullable();
            $table->boolean("reload")->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teams');
    }
};
