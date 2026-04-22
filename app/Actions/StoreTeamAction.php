<?php

namespace App\Actions;

use Illuminate\Support\Facades\Http;
use App\Models\Country;
use ArPHP\I18N\Arabic;
use Illuminate\Support\Str;
use App\Models\Team;
use Illuminate\Support\Facades\Log;

class StoreTeamAction {
    public static function handle($teamId) {
        $key =  env("GOAL_SERVE_KEY");
        $endPoint = env("GOAL_SERVE_ENDPOINT");

        $req = Http::get("{$endPoint}/{$key}/soccerstats/team/$teamId?json=1");

        $collection = $req->collect();

        $newTeam = @$collection["teams"]["team"];

        if (!$newTeam) {
            Log::info("No team with id: $teamId found on remote API");
            return [];
        }

        $arabic = new Arabic();
        $country = Country::where(["name" => Str::lower($newTeam["country"])])->first();

        if (!$country) {
            Log::info("No country found for team: $teamId");
            return [];
        };

        $venueImage = @$newTeam["venue_image"] ? base64ToImage($newTeam["venue_image"], public_path("assets/images/venues/{$newTeam['@id']}.jpeg")) : null;
        $teamImage = @$newTeam["image"] ? base64ToImage($newTeam["image"], public_path("assets/images/teams/{$newTeam['@id']}.jpeg")) : null;

        $data = [
            "team_id" => $teamId,
            "country_id" => $country->id,
            "is_women" => (bool) @$newTeam["@is_women"] == "" ? false : (@$newTeam["@is_women"] == "False" ? false : true),
            "is_national_team" => (bool) $newTeam["@is_national_team"] == "" ? false : (@$newTeam["@is_national_team"] == "False" ? false : true),
            "slug" => makeSlug(new Team(), @$newTeam["name"]),
            "slug_ar" => makeSlug(new Team(), getArabic(@$newTeam["name"]), 'slug_ar'),
            "name" => @$newTeam["name"],
            "name_ar" => getArabic(@$newTeam["name"]),
            "fullname" => @$newTeam["fullname"],
            "fullname_ar" => getArabic(@$newTeam["fullname"]),
            "founded" => @$newTeam["founded"],
            "founded_ar" => getArabic(@$newTeam["founded"]),
            "leagues" => json_encode(@$newTeam["leagues"]),
            "venue_name" => @$newTeam["venue_name"],
            "venue_name_ar" => getArabic(@$newTeam["venue_name"]),
            "venue_id" => @$newTeam["venue_id"],
            "venue_surface" => @$newTeam["venue_surface"],
            "venue_address" => json_encode(@$newTeam["venue_address"]),
            "venue_city" => json_encode(@$newTeam["venue_city"]),
            "venue_capacity" => @$newTeam["venue_capacity"],
            "venue_capacity_ar" => getArabic(@$newTeam["venue_capacity"]),
            "venue_image" => $venueImage ? url("assets/images/venues/{$newTeam['@id']}.jpeg") : null,
            "image" => $teamImage ? url("assets/images/teams/{$newTeam['@id']}.jpeg") : null,
            "squad" => json_encode(@$newTeam["squad"]),
            "coach" => json_encode(@$newTeam["coach"]),
            "transfers" => json_encode(@$newTeam["transfers"]),
            "statistics" => json_encode(@$newTeam["statistics"]),
            "detailed_stats" => json_encode(@$newTeam["detailed_stats"]),
            "sidelined" => json_encode(@$newTeam["sidelined"]),
            "trophies" => json_encode(@$newTeam["trophies"]),
            "reload" => 0
        ];


        $team = Team::updateOrCreate(["team_id" => $teamId], $data);

        $team->refresh();

        $team->load("country");

        return $team;
    }
}