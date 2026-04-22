<?php

namespace App\Http\Controllers;

use App\Actions\DropImageAction;
use App\Actions\DropVideoAction;
use App\Enums\NewsType;
use App\Jobs\OptimizeImageJob;
use App\Models\Author;
use App\Models\Image;
use App\Models\News;
use App\Models\Seo;
use App\Models\Slider;
use App\Services\NewsService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Spatie\Image\Enums\Fit;
use Spatie\Image\Image as SpatieImage;

use function Symfony\Component\Clock\now;

class NewsController extends Controller
{
    public function __construct(private NewsService $service)
    {
        
    }

    public function index()
    {
        return Inertia::render("backend/news/index", []);
    }


    public function show() {
        try {
            return News::with(["images", "tags", "categories", "author", "teams", "leagues"])->latest()->paginate(3)->through(function($row) {
                return [
                    "id" => $row->id,
                    "slug" => $row->slug,
                    "slug_ar" => $row->slug_ar,
                    "title" => $row->title,
                    "title_ar" => $row->title_ar,
                    "type" => $row->type,
                    "status" =>  (bool) $row->status,
                    "created" => Carbon::parse($row->created_at)->format("d, M Y"),
                    "scheduled" => $row->scheduled_for,
                    "images" => collect(@$row->images ?? [])->map(fn($item) => @$item["url"])->values(),
                    "tags" => count($row->tags) > 0 ? collect($row->tags)->map(fn($item) => $item["title"]." (".$item["title_ar"].")")->values() : null,
                    "teams" => count($row->teams) > 0 ? collect($row->teams)->map(fn($item) => $item["name"] . " (" . $item["name_ar"] . ")")->values() : null,
                    "categories" => count($row->categories) > 0 ? collect($row->categories)->map(fn($item) => $item["title"]." (".$item["title_ar"].")")->values() : null,
                    "leagues" => count($row->leagues) > 0 ? collect($row->leagues)->map(fn($item) => $item["name"] . " (" . $item["name_ar"] . ")")->values() : null,
                    "video_url" => $row->video_url,
                    "author" => @$row->author ? [
                        "id" => $row->author->id,
                        "name" => $row->author->name." (". $row->author->name_ar.")",
                    ] : null
                ];
            });
        } catch (\Exception $e) {

            Log::error($e);
            return [];
        }
    }
    
    public function store(Request $request) {
        try {
            
            $news = $this->service->store($request);

            $message = $request->isMethod("POST") ? "News created successfully." : "News updated successfully.";

            return response()->json(["status" => true, "message" => $message]);

        } catch (\Exception $e) {
           
            return response()->json(["status" => false, "message" => $e->getMessage()], 500);
        }
    }

    public function create()
    {
        return Inertia::render("backend/news/create", [
            "newsTypes" => Inertia::defer(fn() => collect(NewsType::cases())->map(fn($item) => ["value" => $item->value, "text" => ucfirst($item->value)])),
            "authors" => Inertia::defer(fn() => authors()),
            "leagues" => Inertia::defer(fn() => leagues()),
            "teams" => Inertia::defer(fn() => teams())
        ]);
    }


    public function edit($slug)
    {
        return Inertia::render("backend/news/create", [
            "newsTypes" => Inertia::defer(fn() => collect(NewsType::cases())->map(fn($item) => ["value" => $item->value, "text" => ucfirst($item->value)])),
            "authors" => Inertia::defer(fn() => authors()),
            "leagues" => Inertia::defer(fn() => leagues()),
            "teams" => Inertia::defer(fn() => teams()),
            "news" => Inertia::defer(fn() => News::with(["images", "tags", "categories", "author", "teams", "seo", "leagues"])->whereSlug($slug)->first())
        ]);
    }
}
