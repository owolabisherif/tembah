<?php

namespace App\Actions;


class PageTypeRouteAction {
    public static function handle(string $type, ?string $page) {

        $types = [
            "all" => route('text.news.index'),
            'tags' => route('tag.news', ["slug" => $type]),
            "categories" => route('category.news.index', ['slug' => $type]),
            'trending' => route('trending.news.index'),
            "articles" => route('article.news.index'),
            'transfer' => route('transfer.news.index')
        ];


        return @$types[$type] ?? @$types[$page] ?? route('home');
    }
}