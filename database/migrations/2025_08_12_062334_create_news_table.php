<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('news', function (Blueprint $table) {
            $table->id();
            $table->string("slug");
            $table->string("slug_ar");
            $table->string("type")->default("text"); //video //reels
            $table->unsignedBigInteger("user_id")->index(); //posted by ?;
            $table->unsignedBigInteger("author_id")->default(0)->index();
            $table->string("title");
            $table->string("title_ar");
            $table->longText("body");
            $table->longText("body_ar");
            $table->string("image");
            $table->string("video_url")->nullable();
            $table->json("options"); //category_ids,tag_id
            // $category_id = DB::connection()->getQueryGrammar()->wrap('options->category_ids');
            $tag_ids = DB::connection()->getQueryGrammar()->wrap('options->tag_ids');
            // $tags_ar = DB::connection()->getQueryGrammar()->wrap('options->tags_ar');
            // $table->json('category_ids')->storedAs($category_id);
            $table->json('tag_ids')->storedAs($tag_ids);
            // $table->array('tags_ar')->storedAs($tags_ar);
            $table->boolean("is_featured")->default(0);
            $table->boolean("in_slider")->default(0);
            $table->boolean("is_top")->default(0);
            $table->unsignedBigInteger("views")->default(0);
            $table->timestamp("scheduled_for")->nullable();
            $table->boolean("status")->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('news');
    }
};
