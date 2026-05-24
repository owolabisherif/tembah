<?php

namespace App\Services;

use App\Actions\DropImageAction;
use App\Jobs\OptimizeImageJob;
use App\Models\Category;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CategoryService
{
    /**
     * Create a new class instance.
     */
    public function store(Request $request)
    {
        try {
            DB::beginTransaction();

            $keywords = array();
            $imagePaths = array();
            $imagePath = 'uploads/images';

            $status = $request->status == 'true' ? true: false;

            $category = Category::updateOrCreate([
                "id" => $request->id ?? null
            ], [
                "slug" => makeSlug(new Category, $request->title),
                "slug_ar" => makeSlug(new Category, $request->titleAr, "slug_ar"),
                "title" => $request->title,
                "title_ar" => $request->titleAr,
                "status" => $status,
                "sort" => $request->sort ?? 0
            ]);

            if ($request->isMethod("PUT")) DropImageAction::handle($category, Category::class, $imagePath);

            if ($request->images && count($request->images) > 0) {
                $path = $request->images[0]->store($imagePath, "public");
                $imagePaths[] = $path;
                $imageArray = explode("/", $path);
                $name = array_pop($imageArray);

                $category->image()->updateOrCreate(["imageable_id" => $category->id], [
                    "name" => $name,
                ]);

                OptimizeImageJob::dispatch($imagePaths);
            }

            if ($request->meta_title != "" && $request->meta_title_ar != "") {
                $category->seo()->updateOrCreate(["seoable_id" => $category->id], [
                    "meta_title" => $request->meta_title,
                    "meta_title_ar" => $request->meta_title_ar,
                    "meta_desc" => $request->meta_desc,
                    "meta_desc_ar" => $request->meta_desc_ar,
                    "keywords" => implode(", ", $keywords),
                    "keywords_ar" => implode(", ", $keywords),
                ]);
            }

            DB::commit();

            return $category;
        } catch (QueryException $e) {
            DB::rollBack();
            
            Log::error($e);

            throw $e;
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error($e);

            throw $e;
        }
    }
}
