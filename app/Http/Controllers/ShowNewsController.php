<?php

namespace App\Http\Controllers;

use App\Actions\PageTypeRouteAction;
use App\Models\Article;
use App\Models\News;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ShowNewsController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(string $slug, string $type, ?string $page)
    {        
        return Inertia::render("news-show", [
            "slug" => $slug,
            "type" => [
                "text" => $type,
                "url" => PageTypeRouteAction::handle($type, $page),
                "page" => $page
            ],
          ...$this->payload($slug, $type)
        ]);


    }


    private function payload(string $slug, string $type): array {
        $output = [];

        if ($type == 'articles') {
            $output["news"] = Article::with(["author.image", "images", "tags", "seo"])->whereSlug($slug)->first();
        } else {
            $output["news"] = News::with(["images", "tags", "author", "author.image", "seo"])->whereSlug($slug)->first();
        }

        $data = $output["news"];

        $output["seo"] = $data->seo ? [
                "meta_title" => $data->seo->meta_title,
                "meta_title_ar" => $data->seo->meta_title_ar,
                "meta_desc" => $data->seo->meta_desc,
                "meta_desc_ar" => $data->seo->meta_desc_ar,
                "keywords" => $data->seo->keywords,
                "keywords_ar" => $data->seo->keywords_ar,
                "image" => $data->images[0]["name"],
                "url" => url()->current(),
                "author" => $data->author ?? null,
                "published" => Carbon::parse($data->getRawOriginal('created_at'))->format("Y-m-d H:m:s"),
                "modified" => Carbon::parse($data->getRawOriginal('updated_at'))->format("Y-m-d H:m:s"),
                "type" => $type == 'articles' ? "article" : 'news'
        ] : null;

       return $output;
    }
}
