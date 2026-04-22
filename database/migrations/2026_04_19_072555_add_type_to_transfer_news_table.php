<?php

use App\Models\Author;
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
        Schema::table('transfer_news', function (Blueprint $table) {
            $table->foreignIdFor(Author::class)->after("user_id")->default(0);
            $table->timestamp("scheduled_for")->after("status")->nullable();
            $table->after("body_ar", function ($table) {
                $table->string("type")->default("text");
                $table->string("video_url")->nullable();
            });
            $table->after("id", function ($table) {
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
        Schema::table('transfer_news', function (Blueprint $table) {
            $table->dropForeignIdFor(Author::class);
            $table->dropColumn("type");
            $table->dropColumn("video_url");
            $table->dropColumn("slug");
            $table->dropColumn("slug_ar");
            $table->dropColumn("scheduled_for");
        });
    }
};
