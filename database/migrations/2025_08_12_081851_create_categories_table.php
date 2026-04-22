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
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            // $table->unsignedBigInteger("categoryable_id");
            // $table->string("categoryable_type");
            $table->string("slug");
            $table->string("title");
            $table->string("title_ar");
            $table->string("type"); //news or league
            $table->boolean("staus")->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
