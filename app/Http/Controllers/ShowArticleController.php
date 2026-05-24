<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;

class ShowArticleController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function index()
    {
        $locale = App::getLocale();
        return inertia('news-show-all', [
            "title" => __("articles"),
            "type" => [
                "text" => "articles",
            ],
            "page" => route("article.news.show")
        ]);
    }


    public function show()
    {
        $articles = Article::with(["author", "images", "tags"])->latest()->paginate(3);

        return $articles;
    }
}
