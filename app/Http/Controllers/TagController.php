<?php

namespace App\Http\Controllers;

use App\Actions\DropImageAction;
use App\Models\Tag;
use App\Services\TagService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;

class TagController extends Controller
{
    public function __construct(private TagService $service)
    {
        //
    }

    public function index()
    {
        
        return Inertia::render("backend/tag/index", []);
    }

    public function create()
    {
        return Inertia::render("backend/tag/create", []);
    }

    public function store(Request $request)
    {
        try {
            
            $tag = $this->service->store($request);

            return response()->json(["value" => $tag->id, "text" => $tag->title . "(" . $tag->title_ar . ")", "message" => "Tag created successfully."]);
        } catch (\Exception $e) {
            Log::error($e);

            DB::rollBack();

            return response()->json(["status" => false, "message" => $e->getMessage()], 500);
        }
    }
}
