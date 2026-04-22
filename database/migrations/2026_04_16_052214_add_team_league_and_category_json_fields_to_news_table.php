<?php

use App\Models\News;
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
        Schema::disableForeignKeyConstraints();

        Schema::table('news', function (Blueprint $table) {
            News::truncate();

            $team_id = DB::connection()->getQueryGrammar()->wrap('options->team_ids');
            $category_id = DB::connection()->getQueryGrammar()->wrap('options->category_ids');
            $league_id = DB::connection()->getQueryGrammar()->wrap('options->league_ids');

            $table->after('tag_ids', function($table) use ($team_id, $category_id, $league_id) {
                $table->json('category_ids')->storedAs($category_id);
                $table->json('team_ids')->storedAs($team_id);
                $table->json('league_ids')->storedAs($league_id);
            });
        });


        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('news', function (Blueprint $table) {
            $table->dropColumn('category_ids');
            $table->dropColumn('team_ids');
            $table->dropColumn('league_ids');
        });
    }
};
