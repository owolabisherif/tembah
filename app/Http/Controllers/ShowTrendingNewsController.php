<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;

class ShowTrendingNewsController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function index()
    {
        
        return inertia('news-show-all', [
            "title" => __("trending"),
            "type" => [
                "text" => "trending"
            ],
            "page" => route("trending.news.show")
        ]);
    }


    public function show()
    {
        $news = News::withWhereHas("stats", function ($q) {
            $q->where('count', ">", 0);
        })->with(["images", "tags", "author", "author.image"])->paginate(5)->through(function ($item) {
            $count = collect($item->stats)->sum('count');
            $item["count"] =  $count;

            return $item;
        });

        return $news;
    }
}
