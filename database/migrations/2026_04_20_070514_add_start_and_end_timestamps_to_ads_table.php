<?php

use App\Models\User;
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
        Schema::table('ads', function (Blueprint $table) {
            $table->foreignIdFor(User::class)->after("id");
            $table->after('priority', function($table) {
                $table->timestamp("starts_at")->nullable();
                $table->timestamp("ends_at")->nullable();
            });
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ads', function (Blueprint $table) {
            $table->dropForeignIdFor(User::class);
            $table->dropColumn('starts_at');
            $table->dropColumn('ends_at');
        });
    }
};
