<?php

namespace App\Actions;

use App\Enums\NewsType;
use App\Models\News;
use App\Models\Slider;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;

class GetHomePageNewsAction {
    public static function handle(NewsType $newsType, int $count = 0, bool $randomize = false, bool $isTop = false, bool $getRecent = false, bool $getSlider = false) {

        $newsTypeVal = $newsType->value;

        if($getSlider) {
            return Cache::remember(
                "home-slider",
                Carbon::now()->addMinutes(30),
                function () {
                    $sliders = Slider::with([])->inRandomOrder()->latest()->whereStatus(1)->get()->map(function($item) {
                        $item["page"] = $item->sliderable_type == 'App\Models\Article' ? 'articles' : 'all';

                        return $item;
                    })->values();

                    if(!$sliders->count()) $sliders = News::with(["image", "author", "author.image"])->inRandomOrder()->latest()->whereStatus(1)->take(1)->get();

                    return $sliders;
                });
        }

        if($isTop && $getRecent) {            
            return Cache::remember("home-top-recent-news", Carbon::now()->addMinutes(30), function () {
                $top = News::with(["images", "author", "author.image"])->where(function($q) {
                    $q->whereStatus(1)->whereIsTop(1);
                })->inRandomOrder()->limit(3)->get();

                $recent = News::with(["images", "author", "author.image"])->latest()->whereStatus(1)->limit(3)->get();
    
                $news = ["top" => $top, "recent" => $recent];
    
                return $news;
            });
        }

        if($isTop) {
            return Cache::remember("home-top-news", Carbon::now()->addMinutes(30), function () {
                return News::with(["images", "author","author.image"])->latest()->inRandomOrder()->whereStatus(1)->whereIsTop(1)->limit(3)->get();
            });
        }

        if($getRecent) {
            return Cache::remember("home-recent-news-today-$newsTypeVal", Carbon::now()->addMinutes(30), function () use ($newsType) {
                return News::with(["images", "author","author.image"])->latest()->whereType($newsType)->whereStatus(1)->limit(3)->get();
            });
        }

        if($count > 0 && $randomize) {
            return News::with(["images", "author","author.image"])->latest()->inRandomOrder()->whereType($newsType)->whereStatus(1)->limit($count)->get();
            return Cache::remember(
                "home-news-today-$newsTypeVal",
                Carbon::now()->addMinutes(30),
                function () use ($count, $newsType) {
                });
        }

        if($count > 0 && !$randomize) {
            return News::with(["images", "author","author.image"])->latest()->limit($count)->whereStatus(1)->whereType($newsType)->get();
        }

        if ($randomize && $count == 0) {
            return News::with(["images", "author","author.image"])->latest()->inRandomOrder()->whereStatus(1)->whereType($newsType)->get();
        }

        return Cache::remember(
            "home-all-news-$newsTypeVal",
            Carbon::now()->addMinutes(30),
            function () use ($newsType) {
                return News::with(["images", "author","author.image"])->latest()->whereType($newsType)->whereStatus(1)->get();
            });
        
    }
}