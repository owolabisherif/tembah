<?php

namespace App\Http\Controllers;

use App\Actions\DropImageAction;
use App\Models\Category;
use App\Models\News;
use App\Services\CategoryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

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

            Cache::forget("home-page-category-news");

            return response()->json(["value" => $category->id, "text" => $category->title."(".$category->title_ar.")", "message" => "Category created successfully."]);
        } catch (\Exception $e) {
           Log::error($e);

            return response()->json(["status" => false, "message" => $e->getMessage()], 500);
        }
    }

    public function show()
    {
        try {
            return Category::with(["image"])->orderBy("sort", "ASC")->paginate(10)->through(function ($q) {
                $q->imageUrl = @$q->image->name;

                return $q;
            });
        } catch (\Exception $e) {

            return response()->json(["status" => false, "message" => $e->getMessage()], 500);
        }
    }

    public function edit(Category $category)
    {
        $category->load(["seo", "image"]);

        return Inertia::render("backend/category/create", [
            "category" => $category
        ]);
    }

    public function delete(Category $category)
    {
        try {
            $hasNews = News::whereJsonContains("category_ids", $category->id)->exists();

            if($hasNews) {
                return response()->json(["status" => false, "message" => "Forbidden: Category cannot be deleted."], Response::HTTP_FORBIDDEN);
            }

            DropImageAction::handle($category, Category::class, 'uploads/images');

            Cache::forget("home-page-category-news");

            $category->delete();
        } catch (\Exception $e) {

            return response()->json(["status" => false, "message" => $e->getMessage()], 500);
        }
    }
}
