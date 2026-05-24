<?php

namespace App\Http\Controllers;

use App\Actions\DropImageAction;
use App\Models\News;
use App\Models\Tag;
use App\Services\TagService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

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

    public function show()
    {
        try {
            return Tag::with(["image"])->paginate(10)->through(function ($q) {
                $q->imageUrl = @$q->image->name;

                return $q;
            });
        } catch (\Exception $e) {

            return response()->json(["status" => false, "message" => $e->getMessage()], 500);
        }
    }

    public function edit(Tag $tag)
    {
        $tag->load(["seo", "image"]);

        return Inertia::render("backend/tag/create", [
            "tag" => $tag
        ]);
    }

    public function delete(Tag $tag)
    {
        try {
            $hasNews = News::whereJsonContains("tag_ids", $tag->id)->exists();

            if ($hasNews) {
                return response()->json(["status" => false, "message" => "Forbidden: Tag cannot be deleted."], Response::HTTP_FORBIDDEN);
            }

            DropImageAction::handle($tag, Tag::class, 'uploads/images');
            $tag->delete();
        } catch (\Exception $e) {

            return response()->json(["status" => false, "message" => $e->getMessage()], 500);
        }
    }
}
