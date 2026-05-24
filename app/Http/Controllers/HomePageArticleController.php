<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class HomePageArticleController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke()
    {
        return Cache::remember("home-page-article", now()->addMinutes(60), function() {
            return Article::with(["author", "images", "tags"])->whereStatus(1)->latest()->take(10)->get();
        });
    }
}
