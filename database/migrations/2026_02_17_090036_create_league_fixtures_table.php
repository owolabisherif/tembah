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
        Schema::create('league_fixtures', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("league_id");
            $table->string("league");
            $table->string("country");
            $table->date("date");
            $table->json("match");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('league_fixtures');
    }
};
