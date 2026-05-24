<?php

namespace App\Http\Controllers;

use App\Models\News;
use App\Models\Tag;
use Illuminate\Http\Request;

class ShowTagNewsController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function index(string $slug)
    {
        $tag = Tag::whereSlug($slug)->first(["id", "slug", "slug_ar", "title", "title_ar"]);

        return inertia('news-show-all', [
            "title" => session('lang') == 'en' ? $tag->slug : $tag->slug_ar,
            "type" => [
                "text" => $tag->title,
                "page" => "tags",
            ],
            "page" => route('tag.news.show', ["id" => $tag->id])
        ]);
    }


    public function show(int $id) {
        return News::with(["images", "tags", "author", "author.image"])->latest()->whereJsonContains("tag_ids", intval($id))->paginate(5);
    }
}
