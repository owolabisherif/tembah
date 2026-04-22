<?php

namespace App\Http\Controllers;

use App\Enums\NewsType;
use App\Services\TransferNewsService;
use Illuminate\Http\Request;
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
}
