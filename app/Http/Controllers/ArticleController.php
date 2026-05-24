<?php

namespace App\Http\Controllers;

use App\Enums\NewsType;
use App\Jobs\SitemapJob;
use App\Models\Article;
use App\Services\ArticleService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ArticleController extends Controller
{
    public function __construct(private ArticleService $service)
    {
        //
    }

    public function index()
    {
        
        return Inertia::render("backend/article/index", []);
    }

    public function store(Request $request)
    {
        try {
            $news = $this->service->store($request);

            SitemapJob::dispatch();

            return response()->json(["status" => true, "message" => "Article created successfully."]);
        } catch (\Exception $e) {

            return response()->json(["status" => false, "message" => $e->getMessage()], 500);
        }
    }


    public function create()
    {
        return Inertia::render("backend/article/create", [
            "newsTypes" => Inertia::defer(fn() => collect(NewsType::cases())->map(fn($item) => ["value" => $item->value, "text" => ucfirst($item->value)])),
            "authors" => Inertia::defer(fn() => authors()),
            "leagues" => Inertia::defer(fn() => leagues()),
            "players" => Inertia::defer(fn() => players()),
            "teams" => Inertia::defer(fn() => teams())
        ]);
    }


    public function show()
    {
        try {
            return Article::with(["image", "tags", "categories", "author", "teams", "leagues", "players"])->latest()->paginate(3)->through(function ($row) {
                return [
                    "id" => $row->id,
                    "slug" => $row->slug,
                    "slug_ar" => $row->slug_ar,
                    "title" => $row->title,
                    "title_ar" => $row->title_ar,
                    "type" => $row->type,
                    "status" =>  (bool) $row->status,
                    "created" => $row->created_at,
                    "scheduled" => Carbon::parse($row->scheduled_for)->format("d, M Y H:m:s"),
                    "image" => @$row->image->name,
                    "tags" => count($row->tags) > 0 ? collect($row->tags)->map(fn($item) => $item["title"] . " (" . $item["title_ar"] . ")")->values() : null,
                    "teams" => count($row->teams) > 0 ? collect($row->teams)->map(fn($item) => $item["name"] . " (" . $item["name_ar"] . ")")->values() : null,
                    "categories" => count($row->categories) > 0 ? collect($row->categories)->map(fn($item) => $item["title"] . " (" . $item["title_ar"] . ")")->values() : null,
                    "leagues" => count($row->leagues) > 0 ? collect($row->leagues)->map(fn($item) => $item["name"] . " (" . $item["name_ar"] . ")")->values() : null,
                    "players" => count($row->players) > 0 ? collect($row->players)->map(fn($item) => $item["name"] . " (" . $item["name_ar"] . ")")->values() : null,
                    "in_slider" => (bool)$row->in_slider,
                    "video_url" => $row->video_url,
                    "author" => @$row->author ? [
                        "id" => $row->author->id,
                        "name" => $row->author->name . " (" . $row->author->name_ar . ")",
                    ] : null
                ];
            });
        } catch (\Exception $e) {
            Log::error($e);
            return [];
        }
    }


    public function edit($slug)
    {
        return Inertia::render("backend/article/create", [
            "newsTypes" => Inertia::defer(fn() => collect(NewsType::cases())->map(fn($item) => ["value" => $item->value, "text" => ucfirst($item->value)])),
            "authors" => Inertia::defer(fn() => authors()),
            "leagues" => Inertia::defer(fn() => leagues()),
            "teams" => Inertia::defer(fn() => teams()),
            "players" => Inertia::defer(fn() => players()),
            "article" => Inertia::defer(fn() => Article::with(["image", "tags", "author", "teams", "seo", "leagues", "players"])->whereSlug($slug)->first())
        ]);
    }

    public function delete(Article $article)
    {
        try {
            $article->delete();

            return response()->json(["status" => true, "message" => "Delete successfully."]);
        } catch (\Exception $e) {

            return response()->json(["status" => false, "message" => $e->getMessage()], 500);
        }
    }
}
