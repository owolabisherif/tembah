<?php

namespace App\Services;

use App\Actions\CacheDropAction;
use App\Actions\DropImageAction;
use App\Actions\DropVideoAction;
use App\Enums\NewsType;
use App\Jobs\OptimizeImageJob;
use App\Models\Image;
use App\Models\News;
use App\Models\Seo;
use App\Models\Slider;
use Carbon\Carbon;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class NewsService
{
    /**
     * Create a new class instance.
     */
    public function store(Request $request)
    {
        try {            
            DB::beginTransaction();

            $categories = array();
            $teams = array();
            $leagues = array();
            $tags = array();
            $imagePaths = array();
            $images = array();
            $players = array();
            $countries = array();
            $videoUrl = null;


            if ($request->categories && !empty($request->categories)) {
                foreach ($request->categories as $cat) {
                    $id = $cat["id"] ?? $cat["value"];
                    $categories[] = (int) $id;
                }
            }

            if ($request->tags && !empty($request->tags)) {
                foreach ($request->tags as $cat) {
                    $id = $cat["id"] ?? $cat["value"];
                    $tags[] = (int) $id;
                }
            }

            if ($request->leagues && !empty($request->leagues)) {
                foreach ($request->leagues as $cat) {
                    $id = $cat["id"] ?? $cat["value"];
                    $leagues[] = (int) $id;
                }
            }

            if ($request->teams && !empty($request->teams)) {
                foreach ($request->teams as $cat) {
                    $id = $cat["id"] ?? $cat["value"];
                    $teams[] = (int) $id;
                }
            }

            if ($request->players && !empty($request->players)) {
                foreach ($request->players as $cat) {
                    $id = $cat["id"] ?? $cat["value"];
                    $players[] = (int) $id;
                }
            }

            if ($request->countries && !empty($request->countries)) {
                foreach ($request->countries as $cat) {
                    $id = $cat["id"] ?? $cat["value"];
                    $countries[] = (int) $id;
                }
            }


            $videoPath = 'uploads/videos';
            $imagePath = 'uploads/images';

            if ($request->type == NewsType::Video->value) {
                if ($request->isMethod("PUT")) DropVideoAction::handle(new News(), $request->id, $videoPath);

                $videoUrl = $request->video->store($videoPath, "public");

                $videoUrl = explode("/", $videoUrl);
                $videoUrl = array_pop($videoUrl);
            }

            $scheduled = $request->action["type"] == "schedule" ? Carbon::parse($request->action["payload"])->setTimezone('Asia/Qatar')->format("Y-m-d H:i:s") : null;

            $slug = makeSlug(new News, $request->title);
            $slugAr = makeSlug(new News, $request->title_ar, "slug_ar");

            $status = $request->status == 'true' ? 1 : 0;
            $inSlider = $request->in_slider == 'true' ? 1 : 0;
            $inTop = $request->in_top == 'true' ? 1 : 0;

            $data = [
                "slug" => $slug,
                "slug_ar" => $slugAr,
                "title" => $request->title,
                "title_ar" => $request->title_ar,
                "type" => $request->type,
                "author_id" => $request->author ?? 0,
                "body" => $request->body,
                "body_ar" => $request->body_ar,
                "options" => [
                    "tag_ids" => $tags,
                    "category_ids" => $categories,
                    "team_ids" => $teams,
                    "league_ids" => $leagues,
                    "player_ids" => $players,
                    "country_ids" => $countries,
                ],
                "status" => $scheduled ? false : $status,
                "video_url" => $request->type === NewsType::Video->value ? $videoUrl : null,
                "scheduled_for" => $scheduled,
                "is_top" => $inTop,
                "in_slider" => $inSlider,
                "user_id" => Auth::id()
            ];

            $news = News::updateOrCreate(["id" => $request->id], $data);

            if ($request->isMethod("PUT")) DropImageAction::handle($news, News::class, $imagePath);

            foreach ($request->images as $image) {
                $path = $image->store($imagePath, "public");
                $imageArray = explode("/", $path);
                $name = array_pop($imageArray);
                $imagePaths[] = $path;
                $images[] = ["imageable_id" => $news->id, "imageable_type" => News::class, "name" => $name, 'created_at' => now(), "updated_at" => now()];
            }

            if ((bool) $inSlider) {
                $news->slider()->updateOrCreate(["sliderable_id" => $news->id], [
                    "slug" => $slug,
                    "slug_ar" => $slugAr,
                    "title" => $request->title,
                    "title_ar" => $request->title_ar,
                    "type" => $request->type,
                    "name" => $images[0]["name"],
                ]);
            }

            if ($request->meta_title != "" && $request->meta_title_ar != "") {
                $news->seo()->updateOrCreate(["seoable_id" => $news->id], [
                    "meta_title" => $request->meta_title,
                    "meta_title_ar" => $request->meta_title_ar,
                    "meta_desc" => $request->meta_desc,
                    "meta_desc_ar" => $request->meta_desc_ar,
                    "keywords" => $request->keywords,
                    "keywords_ar" => $request->keywords_ar,
                ]);
            }

            Image::insert($images);

            DB::commit();

            OptimizeImageJob::dispatch($imagePaths);

           CacheDropAction::handle();
        

            return $news;
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
