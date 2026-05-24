<?php

use App\Models\Slider;
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
        Slider::truncate();
        Schema::table('sliders', function (Blueprint $table) {
            $table->after('id', function($table) {
                $table->string("slug");
                $table->string("slug_ar");
            });
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sliders', function (Blueprint $table) {
            $table->dropColumn("slug");
            $table->dropColumn("slug_ar");
        });
    }
};
