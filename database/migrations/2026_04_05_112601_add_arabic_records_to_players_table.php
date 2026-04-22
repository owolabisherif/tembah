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
            $table->unsignedBigInteger("team_id")->index();
            $table->string("national_team_id")->nullable()->index();
            $table->string("slug");
            $table->string("slug_ar");
            $table->string("name");
            $table->string("name_ar");
            $table->string("common_name")->nullable();
            $table->string("common_name_ar")->nullable();
            $table->string("firstname")->nullable();
            $table->string("firstname_ar")->nullable();
            $table->string("lastname")->nullable();
            $table->string("lastname_ar")->nullable();
            $table->string("fullname")->nullable();
            $table->string("fullname_ar")->nullable();
            $table->string("nationality")->nullable();
            $table->string("nationality_ar")->nullable();
            $table->string("team")->nullable();
            $table->string("team_flag")->nullable();
            $table->string("team_ar")->nullable();
            $table->date("birthdate")->nullable();
            $table->date("birthdate_ar")->nullable();
            $table->string("age")->nullable();
            $table->string("age_ar")->nullable();
            $table->string("birth_country")->nullable();
            $table->string("birth_country_ar")->nullable();
            $table->string("birth_place")->nullable();
            $table->string("birth_place_ar")->nullable();
            $table->string("position")->nullable();
            $table->string("position_ar")->nullable();
            $table->string("height")->nullable();
            $table->string("height_ar")->nullable();
            $table->string("shirt")->nullable();
            $table->string("shirt_ar")->nullable();
            $table->string("weight")->nullable();
            $table->string("weight_ar")->nullable();
            $table->string("preferred_foot")->nullable();
            $table->string("preferred_foot_ar")->nullable();
            $table->string("market_value")->nullable();
            $table->string("image")->nullable();
            $table->json("statistic")->nullable();
            $table->json("statistic_cups")->nullable();
            $table->json("statistic_cups_intl")->nullable();
            $table->json("statistic_intl")->nullable();
            $table->json("trophies")->nullable();
            $table->json("transfers")->nullable();
            $table->json("sidelined")->nullable();
            $table->json("overall_clubs")->nullable();
            $table->boolean("reload")->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('players', function (Blueprint $table) {
            Schema::dropIfExists('players');
        });
    }
};
