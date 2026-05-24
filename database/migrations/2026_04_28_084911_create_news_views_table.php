<?php

use App\Models\News;
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
        Schema::create('news_views', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(News::class)->constrained()->cascadeOnDelete();
            $table->date("date")->index();
            $table->ipAddress("client_ip")->index();
            $table->string("user_agent");
            $table->timestamps();

            $table->unique(["news_id", "client_ip", "date"]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('news_views');
    }
};
