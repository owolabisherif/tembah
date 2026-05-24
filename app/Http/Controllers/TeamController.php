<?php

namespace App\Http\Controllers;

use App\Actions\GetUpdatedTeamAction;
use App\Jobs\OptimizeImageJob;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use ArPHP\I18N\Arabic;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class TeamController extends Controller
{
    public function index() {
     
        return Inertia::render("backend/team/index", []);
    }

    public function show()
    {
        try {
            return Team::orderBy("team_id", "ASC")->with(["country"])->paginate(50);
        } catch (\Exception $e) {
            return response()->json([], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function store(Request $request)
    {
        try {
           
            DB::beginTransaction();

            $is_women = $request->is_women == 'true' ? true : false;
            $is_national_team = $request->is_national_team == 'true' ? true : false;
            $by_pass =  $request->by_pass == 'true' ? true : false;

            Log::info($request->by_pass);
            Log::info($by_pass);

            if ($by_pass) {
                $teamData = null;
                Log::info("Null");
            } else {
                $teamData = GetUpdatedTeamAction::handle($request->team_id);

                Log::info("Here");
            }

            $team = Team::updateOrCreate(["id" => $request->id], [
                "team_id" => $request->team_id,
                "country_id" => $teamData ? $teamData["country_id"] : $request->country_id,
                "is_women" => $teamData ? $teamData["is_women"] : $is_women,
                "is_national_team" => $teamData ? $teamData["is_national_team"] : $is_national_team,
                "slug" => makeSlug(new Team(), $teamData ? $teamData["name"] : $request->name),
                "slug_ar" => makeSlug(new Team(), $teamData ? $teamData["name_ar"] : $request->name_ar, 'slug_ar'),
                "name" => $teamData ? $teamData["name"] : $request->name,
                "name_ar" => $teamData ? $teamData["name_ar"] : $request->name_ar,
                "fullname" => $teamData ? $teamData["fullname"] : $request->fullname,
                "fullname_ar" => $teamData ? $teamData["fullname_ar"] : $request->fullname_ar,
                "founded" => $teamData ? $teamData["founded"] : $request->founded,
                "founded_ar" => getArabic($teamData ? $teamData["founded"] : $request->founded),
                "leagues" => $teamData ? $teamData["leagues"] : $request->leagues,
                "venue_name" => $teamData ? $teamData["venue_name"] : $request->venue_name,
                "venue_name_ar" => getArabic($teamData ? $teamData["venue_name"] : $request->venue_name),
                "venue_id" => $teamData ? $teamData["venue_id"] : $request->venue_id,
                "venue_surface" => $teamData ? $teamData["venue_surface"] : $request->venue_surface,
                "venue_address" => $teamData ? $teamData["venue_address"] : $request->venue_address,
                "venue_city" => $teamData ? $teamData["venue_city"] : $request->venue_city,
                "venue_capacity" => $teamData ? $teamData["venue_capacity"] : $request->venue_capacity,
                "venue_capacity_ar" => getArabic($teamData ? $teamData["venue_capacity"] : $request->venue_capacity),
                "venue_image" => $teamData ? $teamData["venue_image"] : "{$request->team_id}.png",
                "image" => $teamData ? $teamData["image"] : "{$request->team_id}.png",
                "squad" => $teamData ? $teamData["squad"] : $request->squad,
                "coach" => $teamData ? $teamData["coach"] : $request->coach,
                "transfers" => $teamData ? $teamData["transfers"] : $request->transfers,
                "statistics" => $teamData ? $teamData["statistics"] : $request->statistics,
                "detailed_stats" => $teamData ? $teamData["detailed_stats"] : $request->detailed_stats,
                "sidelined" => $teamData ? $teamData["sidelined"] : $request->sidelined,
                "trophies" => $teamData ? $teamData["trophies"] : $request->trophies,
                "reload" => $teamData ? $teamData["reload"] : 0
            ]);

            if ($request->meta_title != "" && $request->meta_title_ar != "") {
                $team->seo()->updateOrCreate(["seoable_id" => $team->id], [
                    "meta_title" => $request->meta_title,
                    "meta_title_ar" => $request->meta_title_ar,
                    "meta_desc" => $request->meta_desc,
                    "meta_desc_ar" => $request->meta_desc_ar,
                    "keywords" => $request->keywords,
                    "keywords_ar" => $request->keywords_ar,
                ]);
            }

            if($by_pass) {
                if ($request->hasFile('image')) {
                    $imagePath = "app/public/uploads/images/teams/{$team->team_id}.png";
                    $file = $request->file('image')->getContent();
    
                    base64ToImage(base64_encode($file), storage_path($imagePath));
    
                    OptimizeImageJob::dispatch(["uploads/images/teams/{$team->team_id}.png"]);
                }

                if ($request->hasFile('venue_image')) {
                    $imagePath = "app/public/uploads/images/venues/{$team->team_id}.png";
                    $file = $request->file('venue_image')->getContent();
    
                    base64ToImage(base64_encode($file), storage_path($imagePath));
    
                    OptimizeImageJob::dispatch(["uploads/images/venues/{$team->team_id}.png"]);
                }
            }


            DB::commit();

            return response()->json(["status" => true, "message" => "Team updated successfully."]);
        } catch (\Exception $e) {
            Log::error($e);
            DB::rollBack();
            return response()->json(["status" => true, "message" => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }


    public function update(Team $team)
    {
        $team->load(["seo", "country"]);

        return Inertia::render("backend/team/team-form", [
            "team" => $team
        ]);
    }
}
