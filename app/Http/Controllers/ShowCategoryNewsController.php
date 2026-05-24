<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\News;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ShowCategoryNewsController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function index(string $slug)
    {
        $category = Category::whereSlug($slug)->first(["id", "title", "title_ar", "slug", "slug_ar"]);

        if(!boolval($category->status)) {
            abort(404);
        }


        return inertia('news-show-all', [
            "title" => session('lang') == 'en' ? $category->slug : $category->slug_ar,
            "type" => [
                "text" => $category->slug,
                "page" => "categories"
            ],
            "page" => route("category.news.show", ["id" => $category->id])
        ]);
    }


    public function show(int $id) {
        // return $id;

        return News::with(["images", "tags", "author", "author.image"])->latest()->whereJsonContains("category_ids", intval($id))->paginate(5);
    }
}
