<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('news', function (Blueprint $table) {
            $country_id = DB::connection()->getQueryGrammar()->wrap('options->country_ids');

            $table->after('player_ids', function ($table) use ($country_id) {
                $table->json('country_ids')->storedAs($country_id);
            });
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('news', function (Blueprint $table) {
            $table->dropColumn("country_ids");
        });
    }
};
