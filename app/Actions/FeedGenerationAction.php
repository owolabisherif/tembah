<?php

namespace App\Actions;

use App\Models\Article;
use App\Models\News;

class FeedGenerationAction {
    public static function handle() {
        $news = News::whereStatus(1)->whereNull('scheduled_for')->get();
        $articles = Article::whereStatus(1)->whereNull('scheduled_for')->get();

        return $news->concat($articles)->sortByDesc('updated_at')->values();
    }
}