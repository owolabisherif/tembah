<?php

namespace App\Http\Controllers;

use App\Enums\NewsType;
use App\Models\Article;
use App\Models\News;
use Illuminate\Http\Request;

class ShowTransferNewsController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function index()
    {
        return inertia('news-show-all', [
            "title" => __("transfer"),
            "type" => [
                "text" => "transfer"
            ],
            "page" => route("transfer.news.show")
        ]);
    }


    public function show()
    {
        return News::with(["images", "tags", "author", "author.image"])->latest()->whereType(NewsType::Transfer)->whereStatus(1)->paginate(5);
    }
}
