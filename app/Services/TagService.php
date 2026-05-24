<?php

namespace App\Services;

use App\Actions\DropImageAction;
use App\Actions\DropVideoAction;
use App\Enums\NewsType;
use App\Jobs\OptimizeImageJob;
use App\Models\Ad;
use App\Models\Image;
use App\Models\Seo;
use App\Models\Slider;
use App\Models\Article;
use App\Models\Tag;
use Carbon\Carbon;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TagService
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

            $status = $request->status == 'true' ? true : false;

            $tag = Tag::updateOrCreate([
                "id" => $request->id ?? null
            ], [
                "slug" => makeSlug(new Tag, $request->title),
                "slug_ar" => makeSlug(new Tag, $request->titleAr, "slug_ar"),
                "title" => $request->title,
                "title_ar" => $request->titleAr,
                "status" => $status,
            ]);

            if ($request->isMethod("PUT")) DropImageAction::handle($tag, Tag::class, $imagePath);

            if ($request->images && count($request->images) > 0) {
                $path = $request->images[0]->store($imagePath, "public");
                $imagePaths[] = $path;
                $imageArray = explode("/", $path);
                $name = array_pop($imageArray);

                $tag->image()->updateOrCreate(["imageable_id" => $tag->id], [
                    "name" => $name,
                ]);

                OptimizeImageJob::dispatch($imagePaths);
            }

            if ($request->meta_title != "" && $request->meta_title_ar != "") {
                $tag->seo()->updateOrCreate(["seoable_id" => $tag->id], [
                    "meta_title" => $request->meta_title,
                    "meta_title_ar" => $request->meta_title_ar,
                    "meta_desc" => $request->meta_desc,
                    "meta_desc_ar" => $request->meta_desc_ar,
                    "keywords" => implode(", ", $keywords),
                    "keywords_ar" => implode(", ", $keywords),
                ]);
            }

            DB::commit();

            return $tag;
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
