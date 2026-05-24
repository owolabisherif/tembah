<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class HomePageCategoryController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function index()
    {
        return Cache::remember("home-page-category-news", now()->addMinutes(60), function () {
            return Category::with(["news", "news.images", "news.tags"])->whereStatus(1)->orderBy('sort')->take(10)->get()->reject(function($q) {
                return count($q->news) == 0;
            })->values();
        });
    }
}
