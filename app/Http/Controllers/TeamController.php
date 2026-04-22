<?php

namespace App\Http\Controllers;

use App\Enums\Status;
use App\Models\Country;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use ArPHP\I18N\Arabic;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TeamController extends Controller
{
    private $key;
    private $endPoint;

    public function  __construct()
    {
        $this->key =  env("GOAL_SERVE_KEY");
        $this->endPoint = env("GOAL_SERVE_ENDPOINT");
    }

    public function index() {
        return Inertia::render("backend/team", []);
    }

    public function show($team_id)
    {
        try {
            ini_set('max_execution_time', 0);

            $team = Team::whereTeamId($team_id)->first();
            $arabic = new Arabic();

            if ($team && $team->reload == 0) {
                dd($team);
            }

            $req = Http::get("{$this->endPoint}/{$this->key}/soccerstats/team/$team_id?json=1");
            $collection = $req->collect();

            $team = @$collection["teams"]["team"];

            if (!$team) {
                dd("No team");
            }

            $country = Country::where(["name" => Str::lower($team["country"])])->first();

            if (!$country) {
                dd("No country");
            }

            DB::beginTransaction();

            $venueImage = base64ToImage($team["venue_image"], public_path("assets/images/venues/{$team_id}.jpeg"));
            $teamImage = base64ToImage($team["image"], public_path("assets/images/teams/{$team_id}.jpeg"));


            $team = Team::updateOrCreate(["team_id" => $team_id], [
                "team_id" => $team_id,
                "country_id" => $country->id,
                "is_women" => (bool) $team["@is_women"] == "" ? false : ($team["@is_women"] == "False" ? false : true),
                "is_national_team" => (bool) $team["@is_national_team"] == "" ? false : ($team["@is_national_team"] == "False" ? false : true),
                "slug" => makeSlug(new Team(), $team["name"]),
                "slug_ar" => makeSlug(new Team(), $arabic->en2ar($team["name"]), 'slug_ar'),
                "name" => $team["name"],
                "name_ar" => $arabic->en2ar($team["name"]),
                "fullname" => $team["fullname"],
                "fullname_ar" => $arabic->en2ar($team["fullname"]),
                "founded" => $team["founded"],
                "founded_ar" => $arabic->en2ar($team["founded"]),
                "leagues" => $team["leagues"],
                "venue_name" => $team["venue_name"],
                "venue_name_ar" => $arabic->en2ar($team["venue_name"]),
                "venue_id" => $team["venue_id"],
                "venue_surface" => $team["venue_surface"],
                "venue_address" => $team["venue_address"],
                "venue_city" => $team["venue_city"],
                "venue_capacity" => $team["venue_capacity"],
                "venue_capacity_ar" => $arabic->en2ar($team["venue_capacity"]),
                "venue_image" => $venueImage ? url("assets/images/venues/{$team_id}.jpeg") : null,
                "image" => $teamImage ? url("assets/images/teams/{$team_id}.jpeg") : null,
                "squad" => $team["squad"],
                "coach" => $team["coach"],
                "transfers" => $team["transfers"],
                "statistics" => $team["statistics"],
                "detailed_stats" => $team["detailed_stats"],
                "sidelined" => $team["sidelined"],
                "trophies" => $team["trophies"],
                "reload" => 0
            ]);

            DB::commit();

            dd($team);
        } catch (\Exception $e) {
            dd($e->getMessage());
            DB::rollBack();
        }
    }
}
