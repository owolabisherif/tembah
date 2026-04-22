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
        Schema::create('leagues', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("league_id")->unique();
            $table->unsignedBigInteger("country_id");
            $table->string("slug")->unique();
            $table->string("slug_ar")->unique();
            $table->string("name");
            $table->string("name_ar");
            $table->string("season");
            $table->string("logo")->nullable();
            $table->boolean("is_cup")->default(false);
            $table->boolean("is_women")->default(false);
            $table->boolean("live_lineups")->default(false);
            $table->boolean("live_stats")->default(false);
            $table->boolean("live_pbp")->default(false);
            $table->string("path")->nullable();
            $table->date("date_start")->nullable();
            $table->date("date_end")->nullable();
            $table->unsignedBigInteger("sort")->default(900000);
            $table->boolean("status")->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leagues');
    }
};
