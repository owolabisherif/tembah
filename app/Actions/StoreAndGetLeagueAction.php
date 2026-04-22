<?php
    namespace App\Actions;

use App\Enums\Status;
use App\Models\Country;
use App\Models\League;
use ArPHP\I18N\Arabic;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class StoreAndGetLeagueAction {

    public static function handle($leagueId) {
        try {
            $disabled = blackListedCountries();
            $international = collect(["intl", "intL", "intl.", "international"]);
            $arabic = new Arabic();
            $key =  env("GOAL_SERVE_KEY");
            $endPoint = env("GOAL_SERVE_ENDPOINT");
            $response = Http::get("{$endPoint}/{$key}/soccerleague/$leagueId?json=1");
    
            $collection = $response->collect();
    
            $league = @$collection["league"];

            if(!$league) return null;
    
            $league_id = (int) $league["@id"];
    
            $countryName = $international->contains(Str::lower($league["@country"])) ? 'international' : Str::lower($league["@country"]);

            DB::beginTransaction();

            $country = Country::updateOrCreate(["slug" => Str::slug($countryName)], [
                "slug" => Str::slug($countryName),
                "sort" => $international->contains($countryName) ? 1 : 3000,
                "logo" => (string) $league_id . ".png",
                "slug_ar" => makeArabicSlug($arabic->en2ar($countryName)),
                "name" => $countryName,
                "name_ar" => $arabic->en2ar($countryName),
                "status" => $disabled->contains($countryName) ? Status::INACTIVE : Status::ACTIVE
            ]);
    
            $country->logo = (string) $country->id . ".png";
    
            $country->save();

            $userCountry = getUserLocation()?->location?->country_name ?? 'Qatar';
    
            $leagueData = League::updateOrCreate(["league_id" => $league_id], [
                "league_id" => $league_id,
                "slug" => makeSlug(new League(), $league["@name"]),
                "slug_ar" => makeSlug(new League(), $arabic->en2ar($league["@name"]), 'slug_ar'),
                "name" => $league["@name"],
                "sort" => strtolower($userCountry) == strtolower($countryName) ? 1 : 3000,
                "name_ar" => $arabic->en2ar($league["@name"]),
                "status" => $disabled->contains(Str::lower($country->name)) ? Status::INACTIVE : Status::ACTIVE,
                "country_id" => $country->id,
                "season" => @$league["@season"] ?? "",
                "logo" => (string) $league_id . ".png",
                "is_cup" => $league["@iscup"] == "" ? false : (bool) ($league["@iscup"] == "False" ? false : true),
                "is_women" => false,
                "live_lineups" => false,
                "live_stats" => false,
                "live_pbp" => false,
                "path" => "",
                "date_start" => now()->format("Y-m-d"),
                "date_end" => now()->format("Y-m-d"),
            ]);

            DB::commit();

            $leagueData->load("country");

            $leagueData->refresh();
    
            return $leagueData;

        } catch (\Exception $e) {
           DB::rollBack();

           Log::error($e);

           return [];
        }
    }
}