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
use Carbon\Carbon;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AdService
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

            $startDate = Carbon::parse($request->starts_at)->setTimezone('Asia/Qatar')->format("Y-m-d H:i:s");
            $endDate = Carbon::parse($request->ends_at)->setTimezone('Asia/Qatar')->format("Y-m-d H:i:s");

            $status = $request->status == 'true' ? true : false;

            $data = [
                "title" => $request->title,
                "type" => $request->type,
                "priority" => $request->priority,
                "status" => $status,
                "url" => $request->url,
                "starts_at" => $startDate,
                "ends_at" => $endDate,
                "user_id" => Auth::id()
            ];

            $ad = Ad::updateOrCreate(["id" => $request->id], $data);

            if ($request->isMethod("PUT")) DropImageAction::handle($ad, Ad::class, $imagePath);

            $path = $request->images[0]->store($imagePath, "public");
            $imagePaths[] = $path;
            $imageArray = explode("/", $path);
            $name = array_pop($imageArray);

            $ad->image()->updateOrCreate(["imageable_id" => $ad->id], [
                "name" => $name, 
            ]);

            if ($request->meta_title != "" && $request->meta_title_ar != "") {
                $ad->seo()->updateOrCreate(["seoable_id" => $ad->id], [
                    "meta_title" => $request->meta_title,
                    "meta_title_ar" => $request->meta_title_ar,
                    "meta_desc" => $request->meta_desc,
                    "meta_desc_ar" => $request->meta_desc_ar,
                    "keywords" => implode(", ", $keywords),
                    "keywords_ar" => implode(", ", $keywords),
                ]);
            }

            DB::commit();

            OptimizeImageJob::dispatch($imagePaths);

            return $ad;
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
