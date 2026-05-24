<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PageController extends Controller
{
    public function index()
    {
        return Inertia::render("backend/seo/page/index", []);
    }


    public function show(string $id) {
        try {
            if($id != 0) {
                $page = Page::with(["seo"])->find($id);
    
                return response()->json($page);
            }
    
            return response()->json(Page::all());
        } catch (\Exception $e) {
            return response()->json(["status" => true, "message" => "An error occured. - {$e->getMessage()}"], 500);
        }
    }



    public function store(Request $request) {
        try {
            DB::beginTransaction();

            $page = Page::findOrFail($request->page);

            $page->title = $request->title;
            $page->title_ar = $request->title_ar;
            $page->body = $request->body;
            $page->body_ar = $request->body_ar;

            $page->save();

            $page->seo()->updateOrCreate(["seoable_id" => $page->id], [
                "meta_title" => $request->meta_title,
                "meta_title_ar" => $request->meta_title_ar,
                "meta_desc" => $request->meta_desc,
                "meta_desc_ar" => $request->meta_desc_ar,
                "keywords" => $request->keywords,
                "keywords_ar" => $request->keywords_ar,
            ]);

            DB::commit();

            return response()->json(["status" => true, "message" => ucwords("{$page->name} SEO updated.")]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json(["status" => false, "message" => "An error occured. - {$e->getMessage()}"], 500);
        }
        
    }
}
