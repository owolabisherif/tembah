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
use App\Models\TransferNews;
use Carbon\Carbon;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TransferNewsService
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
            $players = array();
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

            if ($request->players && !empty($request->players)) {
                foreach ($request->players as $cat) {
                    $id = $cat["id"] ?? $cat["value"];
                    $players[] = (int) $id;
                }
            }


            $videoPath = 'uploads/videos';
            $imagePath = 'uploads/images';

            if ($request->type == NewsType::Video->value) {
                if ($request->isMethod("PUT")) DropVideoAction::handle(new TransferNews(), $request->id, $videoPath);

                $videoUrl = $request->video->store($videoPath, "public");
            }

            $scheduled = $request->action["type"] == "schedule" ? Carbon::parse($request->action["payload"])->setTimezone('Asia/Qatar')->format("Y-m-d H:i:s") : null;

            $data = [
                "slug" => makeSlug(new TransferNews, $request->title),
                "slug_ar" => makeSlug(new TransferNews, $request->title_ar, "slug_ar"),
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
                    "player_ids" => $players
                ],
                "status" => $scheduled ? false : (bool) $request->status,
                "video_url" => $request->type === NewsType::Video->value ? url("/") . "/storage" . "/$videoUrl" : null,
                "scheduled_for" => $scheduled,
                "user_id" => Auth::id()
            ];

            // if($scheduled) {
            //     $data["created_at"] = $scheduled;
            // }

            $news = TransferNews::updateOrCreate(["id" => $request->id], $data);

            if ($request->isMethod("PUT")) DropImageAction::handle($news, TransferNews::class, $imagePath);

            foreach ($request->images as $image) {
                $path = $image->store($imagePath, "public");
                $url = url("/") . "/storage" . "/$path";
                $imagePaths[] = $path;
                $images[] = ["imageable_id" => $news->id, "imageable_type" => TransferNews::class, "url" => $url, 'created_at' => now(), "updated_at" => now()];
            }

            if ((bool) $request->in_slider) {
                $news->slider()->updateOrCreate(["sliderable_id" => $news->id],[
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

            throw $e;
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error($e);

            throw $e;
        }
    }
}
