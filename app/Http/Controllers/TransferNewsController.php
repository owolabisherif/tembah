<?php

namespace App\Http\Controllers;

use App\Enums\NewsType;
use App\Models\TransferNews;
use App\Services\TransferNewsService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class TransferNewsController extends Controller
{
    public function __construct(private TransferNewsService $service)
    {
        //
    }

    public function index()
    {

        return Inertia::render("backend/news/transfer/index", []);
    }

    public function store(Request $request)
    {
        try {
            $news = $this->service->store($request);

            return response()->json(["status" => true, "message" => "Transfer news created successfully."]);
        } catch (\Exception $e) {

            return response()->json(["status" => false, "message" => $e->getMessage()], 500);
        }
    }

    public function create()
    {
        return Inertia::render("backend/news/transfer/create", [
            "newsTypes" => Inertia::defer(fn() => collect(NewsType::cases())->map(fn($item) => ["value" => $item->value, "text" => ucfirst($item->value)])),
            "authors" => Inertia::defer(fn() => authors()),
            "leagues" => Inertia::defer(fn() => leagues()),
            "players" => Inertia::defer(fn() => players()),
            "teams" => Inertia::defer(fn() => teams())
        ]);
    }

    public function show($slug) {
        try {
            return TransferNews::with(["images", "tags", "categories", "author", "teams", "leagues", "players"])->latest()->paginate(3)->through(function ($row) {
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
                    "tags" => count($row->tags) > 0 ? collect($row->tags)->map(fn($item) => $item["title"] . " (" . $item["title_ar"] . ")")->values() : null,
                    "teams" => count($row->teams) > 0 ? collect($row->teams)->map(fn($item) => $item["name"] . " (" . $item["name_ar"] . ")")->values() : null,
                    "categories" => count($row->categories) > 0 ? collect($row->categories)->map(fn($item) => $item["title"] . " (" . $item["title_ar"] . ")")->values() : null,
                    "leagues" => count($row->leagues) > 0 ? collect($row->leagues)->map(fn($item) => $item["name"] . " (" . $item["name_ar"] . ")")->values() : null,
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
        return Inertia::render("backend/news/transfer/create", [
            "newsTypes" => Inertia::defer(fn() => collect(NewsType::cases())->map(fn($item) => ["value" => $item->value, "text" => ucfirst($item->value)])),
            "authors" => Inertia::defer(fn() => authors()),
            "leagues" => Inertia::defer(fn() => leagues()),
            "players" => Inertia::defer(fn() => players()),
            "teams" => Inertia::defer(fn() => teams()),
            "news" => Inertia::defer(fn() => TransferNews::with(["images", "tags", "categories", "players", "teams", "seo", "leagues", "author"])->whereSlug($slug)->first())
        ]);
    }

    public function delete(TransferNews $news) {
        try {
            $news->delete();

            return response()->json(["status" => true, "message" => "Delete successfully."]);
        } catch (\Exception $e) {

            return response()->json(["status" => false, "message" => $e->getMessage()], 500);
        }
    }
}
