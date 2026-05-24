<?php

namespace App\Http\Controllers;

use App\Actions\GetHomePageNewsAction;
use App\Enums\NewsType;
use App\Models\Country;
use App\Models\Page;
use App\Transformers\LeaguesTransformer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use stdClass;

class HomeController extends Controller
{
    public function index()
    {
        $page = Page::with(["seo"])->whereSlug("home")->first();

        // Log::info($page);

        return Inertia::render('welcome', [
            "seo" => @$page->seo, 
            "news" => Inertia::defer(fn() => GetHomePageNewsAction::handle(newsType:NewsType::Text, count:9, randomize:true)),
            "transferNews" => Inertia::defer(fn() => GetHomePageNewsAction::handle(newsType:NewsType::Transfer, count:4, randomize:true)),
            "topNews" => Inertia::defer(fn() => GetHomePageNewsAction::handle(newsType: NewsType::Text, isTop: true)),
            "recentNews" => Inertia::defer(fn() => GetHomePageNewsAction::handle(newsType: NewsType::Text, getRecent: true)),
            "sliders" => Inertia::defer(fn() => GetHomePageNewsAction::handle(newsType: NewsType::Text, getSlider: true)),
        ]);
    }
}
