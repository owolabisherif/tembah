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
        Schema::table('pages', function (Blueprint $table) {
            $table->string('slug')->nullable()->after("id");
            $table->after('name', function($table) {
                $table->string('title')->nullable();
                $table->string('title_ar')->nullable();
                $table->boolean("has_body")->default(false);
                $table->longText("body")->nullable();
                $table->longText("body_ar")->nullable();
            });
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->dropColumn('slug');
            $table->dropColumn('title');
            $table->dropColumn('title_ar');
            $table->dropColumn("has_body");
            $table->dropColumn("body");
            $table->dropColumn("body_ar");
        });
    }
};
