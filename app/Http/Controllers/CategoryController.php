<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Services\CategoryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function __construct(private CategoryService $service)
    {
        //
    }

    public function index()
    {

        return Inertia::render("backend/category/index", []);
    }


    public function create()
    {
        return Inertia::render("backend/category/create", []);
    }


    public function store(Request $request) {
        try {
            $category = $this->service->store($request);

            return response()->json(["value" => $category->id, "text" => $category->title."(".$category->title_ar.")", "message" => "Category created successfully."]);
        } catch (\Exception $e) {
           Log::error($e);

            return response()->json(["status" => false, "message" => $e->getMessage()], 500);
        }
    }
}
