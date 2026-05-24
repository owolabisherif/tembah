<?php

namespace App\Http\Controllers;

use App\Models\Fixture;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class FixturesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render("backend/fixture/index", []);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            DB::beginTransaction();

            $fixture = Fixture::updateOrCreate(["id" => $request->id], [
                "static_id" => $request->static_id,
                "fixture_id" => $request->fixture_id,
                "match" => $request->match,
                "sort" => $request->sort,
            ]);

            if ($request->meta_title != "" && $request->meta_title_ar != "") {
                $fixture->seo()->updateOrCreate(["seoable_id" => $fixture->id], [
                    "meta_title" => $request->meta_title,
                    "meta_title_ar" => $request->meta_title_ar,
                    "meta_desc" => $request->meta_desc,
                    "meta_desc_ar" => $request->meta_desc_ar,
                    "keywords" => $request->keywords,
                    "keywords_ar" => $request->keywords_ar,
                ]);
            }

            DB::commit();

            return response()->json(["status" => true, "message" => "Fixture updated successfully."]);
        } catch(\Exception $e) {
            Log::error($e);
            DB::rollBack();
            return response()->json(["status" => true, "message" => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show()
    {
        try {
            return Fixture::latest("created_at")->paginate(50);
        } catch (\Exception $e) {
            return response()->json([], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Fixture $fixture)
    {
        $fixture->load(["seo"]);
        
        return Inertia::render("backend/fixture/fixture-form", [
            "fixture" => $fixture
        ]);
    }
}
