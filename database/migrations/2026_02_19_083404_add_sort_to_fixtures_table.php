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
        Schema::table('fixtures', function (Blueprint $table) {
            $table->after("id", function($table) {
                $table->unsignedBigInteger("fixture_id")->nullable();
                $table->unsignedBigInteger("static_id");
                $table->string("slug")->nullable();
            });

            $table->unique(["static_id"], "unique_match");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('fixtures', function (Blueprint $table) {
            $table->dropUnique("unique_match");
            $table->dropColumn("slug");
            $table->dropColumn("fixture_id");
            $table->dropColumn("static_id");
        });
    }
};
