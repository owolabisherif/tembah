<?php

namespace App\Http\Controllers;

use App\Actions\DropImageAction;
use App\Actions\GetUpdatedLeagueDataAction;
use App\Enums\Status;
use App\Jobs\OptimizeImageJob;
use App\Jobs\SitemapJob;
use App\Models\Country;
use App\Models\League;
use App\Services\Cacher;
use App\Transformers\AllLeaguesTransformer;
use App\Transformers\LeaguesTranformer;
use ArPHP\I18N\Arabic;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class LeagueController extends Controller
{

    public function index()
    {
        return Inertia::render("backend/league/index", [

        ]);
    }


    public function show() {
        try {
            return League::with(["country"])->orderBy("sort", "ASC")->orderBy("is_top", "DESC")->paginate(50);
        } catch (\Exception $e) {
            return response()->json([], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
       
    }


    public function store(Request $request)
    {
        try {
            DB::beginTransaction();

            $status = $request->status == 'true' ? true : false;
            $is_top = $request->is_top == 'true' ? true : false;
            $is_cup = $request->is_cup == 'true' ? true : false;
            $is_women = $request->is_women == 'true' ? true : false;
            $live_lineups = $request->live_lineups == 'true' ? true : false;
            $live_stats = $request->live_stats == 'true' ? true : false;
            $live_pbp = $request->live_pbp == 'true' ? true : false;
            $by_pass = $request->by_pass || $request->by_pass == 'true' ? true : false;

            if(!$by_pass) {
                list($leagueData, $country) = GetUpdatedLeagueDataAction::handle($request->league_id);
            } else {
                $leagueData = null;
                $country = null;
            }

            $league = League::updateOrCreate(["league_id" => $request->league_id], [
                "slug" => makeSlug(new League(), $request->name),
                "slug_ar" => makeSlug(new League(), $request->name_ar, 'slug_ar'),
                "name" => $request->name,
                "name_ar" => $request->name_ar,
                "sort" => $request->sort,
                "status" => $status,
                "is_top" => $is_top,
                "country_id" => $country ? $country->id : $request->country_id,
                "season" => $leagueData ? $leagueData['@season'] : $request->season,
                "is_cup" => $leagueData ? ($leagueData['@iscup'] == 'False' ? false : true) : $is_cup,
                "is_women" => $leagueData ? ($leagueData['@is_women'] == 'False' ? false : true) : $is_women,
                "live_lineups" => $leagueData ? ($leagueData['@live_lineups'] == 'False' ? false : true) : $live_lineups,
                "live_stats" =>  $leagueData ? ($leagueData['@live_stats'] == 'False' ? false : true) : $live_stats,
                "live_pbp" => $leagueData ? ($leagueData['@live_pbp'] == 'False' ? false : true) : $live_pbp,
                "path" => $leagueData ? $leagueData['@path'] : $request->path,
                "date_start" => $leagueData ? Carbon::parse($leagueData['@date_start'])->format("Y-m-d") : $request->date_start,
                "date_end" => $leagueData ? Carbon::parse($leagueData['@date_end'])->format("Y-m-d") : $request->date_end,
            ]);

            if ($request->meta_title != "" && $request->meta_title_ar != "") {
                $league->seo()->updateOrCreate(["seoable_id" => $league->id], [
                    "meta_title" => $request->meta_title,
                    "meta_title_ar" => $request->meta_title_ar,
                    "meta_desc" => $request->meta_desc,
                    "meta_desc_ar" => $request->meta_desc_ar,
                    "keywords" => $request->keywords,
                    "keywords_ar" => $request->keywords_ar,
                ]);
            }
            
            if ($request->hasFile('logo') ) {
                $imagePath = "app/public/uploads/images/leagues/{$league->league_id}.png";
                $file = $request->file('logo')->getContent();
                
                base64ToImage(base64_encode($file), storage_path($imagePath));

                OptimizeImageJob::dispatch(["uploads/images/leagues/{$league->league_id}.png"]);
            }

            DB::commit();

            DB::afterCommit(function () {
                Cache::forget("all-leagues");
                Cache::forget("top-leagues");
                SitemapJob::dispatch();
            });

            return response()->json(["status" => true, "message" => "League updated successfully."]);
        } catch (\Exception $e) {
            Log::error($e);
            DB::rollBack();
            return response()->json(["status" => true, "message" => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }


    public function update(League $league)
    {
        $league->load(["seo", "country"]);

        return Inertia::render("backend/league/league-form", [
            "league" => $league
        ]);
    }
}
