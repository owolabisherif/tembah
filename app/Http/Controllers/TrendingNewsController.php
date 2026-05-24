<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class TrendingNewsController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke()
    {
        return Cache::remember(
            "home-page-trending-news",
            now()->addMinutes(30),
            function () {

                $news = News::withWhereHas("stats", function($q) {
                    $q->where('count', ">", 0);
                })->with(["images", "tags", "author", "author.image"])->take(10)->get()->map(function($item) {
                    $count = collect($item->stats)->sum('count');
                    $item["count"] =  $count;
        
                    return $item;
                })->sortByDesc("count")->values();
        
                return $news;
        });
    }
}
