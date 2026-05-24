<?php

namespace App\Http\Controllers;

use App\Enums\NewsType;
use App\Models\Article;
use App\Models\News;
use Illuminate\Http\Request;

class ShowTextNewsController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function index()
    {
        return inertia('news-show-all', [
            "title" => __("all"),
            "type" => [
                "text" => "all"
            ],
            "page" => route("text.news.show")
        ]);
    }


    public function show()
    {
        return News::with(["images", "tags", "author", "author.image"])->latest()->whereType(NewsType::Text)->whereStatus(1)->paginate(5);
    }
}
