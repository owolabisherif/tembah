<?php

namespace App\Actions;

use Illuminate\Support\Facades\Http;
use App\Models\Country;
use App\Models\Player;
use ArPHP\I18N\Arabic;
use Illuminate\Support\Str;
use App\Models\Team;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class GetUpdatedPlayerAction {
    public static function handle($playerId, $shirt) {
        $key =  config('api.key');
        $endPoint = config('api.endpoint');
        $ar = new Arabic();

        $req = Http::get("{$endPoint}/{$key}/soccerstats/player/$playerId?json=1");

        $collection = $req->collect();

        $player = @$collection["players"]["player"];

        if (!$player) {
           return null;
        }

        $path = @$player["image"] ? base64ToImage($player["image"], storage_path("app/public/uploads/images/players/{$player['@id']}.png")) : null;
        $image = $path ? "{$player['@id']}.png" : null;

        $date = Carbon::parse(@$player["birthdate"]);

        $team_flag = @$player["teamid"] ? "{$player['teamid']}.png" : null;

        $playerExist = Player::wherePlayerId($playerId)->first();

        $data = [
            "player_id" => $playerId,
            "team_id" => @$player["teamid"],
            "national_team_id" => @$player["@national_team_id"],
            "slug" => makeSlug(new Player(), @$player["name"]),
            "slug_ar" => makeSlug(new Player(), getArabic(@$player["name"]), 'slug_ar'),
            "name" => @$player["name"],
            "name_ar" => getArabic(@$player["name"]),
            "common_name" => @$player["@common_name"],
            "common_name_ar" => getArabic(@$player["@common_name"] ?? ''),
            "fullname" => @$player["fullname"],
            "fullname_ar" => getArabic(@$player["fullname"] ?? ''),
            "firstname" => @$player["firstname"],
            "firstname_ar" => getArabic(@$player["firstname"] ?? ''),
            "lastname" => @$player["lastname"],
            "lastname_ar" => getArabic(@$player["lastname"] ?? ''),
            "nationality" => @$player["nationality"],
            "nationality_ar" => getArabic(@$player["nationality"] ?? ''),
            "birth_country" => @$player["birthcountry"],
            "birth_country_ar" => getArabic(@$player["birthcountry"] ?? ''),
            "birth_place" => @$player["birthplace"],
            "birth_place_ar" => getArabic(@$player["birthplace"] ?? ''),
            "birthdate" => $date->format("Y-m-d"),
            "birthdate_ar" => $ar->date("Y-m-d", $date->timestamp),
            "position" => @$player["position"],
            "position_ar" => getArabic(@$player["position"] ?? ''),
            "age" => @$player["age"],
            "age_ar" => getArabic(@$player["age"] ?? ''),
            "height" => @$player["height"],
            "height_ar" => getArabic(@$player["height"] ?? ''),
            "shirt" => $playerExist && $shirt == 0 ? $playerExist->shirt : $shirt,
            "shirt_ar" => getArabic($shirt ?? ''),
            "preferred_foot" => @$player["preferredFoot"],
            "preferred_foot_ar" => getArabic(@$player["preferredFoot"] ?? ''),
            "market_value" => @$player["marketValueEUR"],
            "weight" => @$player["weight"],
            "weight_ar" => getArabic(@$player["weight"] ?? ''),
            "image" => $image,
            "team" => @$player["team"],
            "team_flag" => $team_flag,
            "team_ar" => getArabic(@$player["team"] ?? ''),
            "statistic" => json_encode(@$player["statistic"]),
            "statistic_cups" => json_encode(@$player["statistic_cups"]),
            "statistic_cups_intl" => json_encode(@$player["statistic_cups_intl"]),
            "transfers" => json_encode(@$player["transfers"]),
            "trophies" => json_encode(@$player["trophies"]),
            "overall_clubs" => json_encode(@$player["overall_clubs"]),
            "reload" => 0
        ];


       return $data;
    }


}