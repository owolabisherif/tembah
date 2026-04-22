<?php

namespace App\Services;

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
            $keywords = array();
            $imagePaths = array();
            $images = array();
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
                    $keywords[] = $cat["label"];
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


            $videoPath = 'uploads/videos';
            $imagePath = 'uploads/images';

            if ($request->type == NewsType::Video->value) {
                if ($request->isMethod("PUT")) DropVideoAction::handle(new News(), $request->id, $videoPath);

                $videoUrl = $request->video->store($videoPath, "public");
            }

            $scheduled = $request->action["type"] == "schedule" ? Carbon::parse($request->action["payload"])->setTimezone('Asia/Qatar')->format("Y-m-d H:i:s") : null;

            $data = [
                "slug" => makeSlug(new News, $request->title),
                "slug_ar" => makeSlug(new News, $request->title_ar, "slug_ar"),
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
                    "league_ids" => $leagues
                ],
                "status" => $scheduled ? false : (bool) $request->status,
                "video_url" => $request->type === NewsType::Video->value ? url("/") . "/storage" . "/$videoUrl" : null,
                "scheduled_for" => $scheduled,
                "is_top" => (bool) $request->in_top,
                "user_id" => Auth::id()
            ];

            $news = News::updateOrCreate(["id" => $request->id], $data);

            if ($request->isMethod("PUT")) DropImageAction::handle($news, News::class, $imagePath);

            foreach ($request->images as $image) {
                $path = $image->store($imagePath, "public");
                $url = url("/") . "/storage" . "/$path";
                $imagePaths[] = $path;
                $images[] = ["imageable_id" => $news->id, "imageable_type" => News::class, "url" => $url, 'created_at' => now(), "updated_at" => now()];
            }

            if ((bool) $request->in_slider) {
                $news->slider()->updateOrCreate(["sliderable_id" => $news->id], [
                    "title" => $request->title,
                    "title_ar" => $request->title_ar,
                    "type" => $request->type,
                    "url" => $images[0]["url"],
                ]);
            }

            if ($request->meta_title != "" && $request->meta_title_ar != "") {
                $news->seo()->updateOrCreate(["seoable_id" => $news->id], [
                    "meta_title" => $request->meta_title,
                    "meta_title_ar" => $request->meta_title_ar,
                    "meta_desc" => $request->meta_desc,
                    "meta_desc_ar" => $request->meta_desc_ar,
                    "keywords" => implode(", ", $keywords),
                    "keywords_ar" => implode(", ", $keywords),
                ]);
            }

            Image::insert($images);

            DB::commit();

            OptimizeImageJob::dispatch($imagePaths);

            return $news;
        } catch (QueryException $e) {
            DB::rollBack();
            
            Log::error($e);
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error($e);

            throw $e;
        }
    }
}
