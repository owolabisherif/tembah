<?php

namespace App\Actions;

use Illuminate\Support\Facades\Cache;

class CacheDropAction {
    public static function handle() {
        $keys = [
            "home-slider",
            'home-news-today-text',
            'home-news-today-video',
            'home-news-today-transfer',
            'home-top-news-today-text',
            'home-top-news-today-video',
            'home-top-news-today-transfer',
            'home-recent-news-today-text',
            'home-recent-news-today-video',
            'home-recent-news-today-transfer',
            'home-all-news-text',
            'home-all-news-video',
            'home-all-news-transfer',
            'home-page-category-news',
            'home-page-trending-news',
            'home-top-recent-news',
        ];
        // Cache::forget('home-news-today-text');
        // Cache::forget('home-news-today-video');
        // Cache::forget('home-news-today-transfer');
        // Cache::forget('home-top-news-today-text');
        // Cache::forget('home-top-news-today-video');
        // Cache::forget('home-top-news-today-transfer');
        // Cache::forget('home-recent-news-today-text');
        // Cache::forget('home-recent-news-today-video');
        // Cache::forget('home-recent-news-today-transfer');
        // Cache::forget('home-all-news-text');
        // Cache::forget('home-all-news-video');
        // Cache::forget('home-all-news-transfer');
        // Cache::forget('home-page-category-news');
        // Cache::forget('home-page-trending-news');


        foreach ($keys as $key ) {
            Cache::forget($key);
        }
    }
}