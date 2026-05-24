<?php

namespace App\Actions;

use Illuminate\Support\Facades\Http;
use App\Models\Country;
use ArPHP\I18N\Arabic;
use Illuminate\Support\Str;
use App\Models\Team;
use Illuminate\Support\Facades\Log;

class GetUpdatedTeamAction {
    public static function handle(int $teamId): array | null {
        try {
            $key =  config('api.key');
            $endPoint = config('api.endpoint');

            $req = Http::get("{$endPoint}/{$key}/soccerstats/team/$teamId?json=1");

            
            $collection = $req->collect();
            
            $newTeam = @$collection["teams"]["team"];
            Log::info($newTeam);

            if (!$newTeam) return null;

            $country = Country::where(["name" => Str::lower($newTeam["country"])])->first();

            $countryId = $country ? $country->id : $teamId;

            $venueImage = @$newTeam["venue_image"] ? base64ToImage($newTeam["venue_image"], storage_path("app/public/uploads/images/venues/{$newTeam['@id']}.png")) : null;
            $teamImage = @$newTeam["image"] ? base64ToImage($newTeam["image"], storage_path("app/public/uploads/images/teams/{$newTeam['@id']}.png")) : null;

            $data = [
                "team_id" => $teamId,
                "country_id" => $countryId,
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
                "leagues" => @$newTeam["leagues"] ? json_encode(@$newTeam["leagues"]) : null,
                "venue_name" => @$newTeam["venue_name"],
                "venue_name_ar" => getArabic(@$newTeam["venue_name"]),
                "venue_id" => @$newTeam["venue_id"],
                "venue_surface" => @$newTeam["venue_surface"],
                "venue_address" => @$newTeam["venue_address"] ? json_encode(@$newTeam["venue_address"]) : null,
                "venue_city" => @$newTeam["venue_city"] ? json_encode(@$newTeam["venue_city"]) : null,
                "venue_capacity" => @$newTeam["venue_capacity"],
                "venue_capacity_ar" => getArabic(@$newTeam["venue_capacity"]),
                "venue_image" => $venueImage ? "{$newTeam['@id']}.png" : null,
                "image" => $teamImage ? "{$newTeam['@id']}.png" : null,
                "squad" => @$newTeam["squad"] ? json_encode(@$newTeam["squad"]) : null,
                "coach" => @$newTeam["coach"] ? json_encode(@$newTeam["coach"]) : null,
                "transfers" => @$newTeam["transfers"] ? json_encode(@$newTeam["transfers"]) : null,
                "statistics" => @$newTeam["statistics"] ? json_encode(@$newTeam["statistics"]) : null,
                "detailed_stats" => @$newTeam["detailed_stats"] ? json_encode(@$newTeam["detailed_stats"]) : null,
                "sidelined" => @$newTeam["sidelined"] ? json_encode(@$newTeam["sidelined"]) : null,
                "trophies" => @$newTeam["trophies"] ? json_encode(@$newTeam["trophies"]) : null, 
                "reload" => 0
            ];

            return $data;
        } catch (\Exception $e) {
            Log::error($e);
            return null;
        }
        
    }
}