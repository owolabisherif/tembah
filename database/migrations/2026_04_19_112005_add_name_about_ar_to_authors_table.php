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
        Schema::table('authors', function (Blueprint $table) {
            $table->string("slug_ar")->after('slug')->nullable();
            $table->string("name_ar")->after('name')->nullable();
            $table->longText("about_ar")->after('about')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('authors', function (Blueprint $table) {
            $table->dropColumn("slug_ar");
            $table->dropColumn("name_ar");
            $table->dropColumn("about_ar");
        });
    }
};
