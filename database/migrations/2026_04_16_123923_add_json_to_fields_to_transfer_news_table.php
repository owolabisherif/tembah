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
        Schema::table('transfer_news', function (Blueprint $table) {
            $table->dropColumn("teams");
            $table->dropColumn("leagues");
            $table->dropColumn("players");

            $tag_id = DB::connection()->getQueryGrammar()->wrap('options->tag_ids');
            $player_id = DB::connection()->getQueryGrammar()->wrap('options->player_ids');
            $team_id = DB::connection()->getQueryGrammar()->wrap('options->team_ids');
            $category_id = DB::connection()->getQueryGrammar()->wrap('options->category_ids');
            $league_id = DB::connection()->getQueryGrammar()->wrap('options->league_ids');

            $table->after('body_ar', function ($table) use ($team_id, $category_id, $league_id, $tag_id, $player_id) {
                $table->json("options");

                $table->json('tag_ids')->storedAs($tag_id);
                $table->json('category_ids')->storedAs($category_id);
                $table->json('player_ids')->storedAs($player_id);
                $table->json('team_ids')->storedAs($team_id);
                $table->json('league_ids')->storedAs($league_id);
            });
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transfer_news', function (Blueprint $table) {
            //
        });
    }
};
