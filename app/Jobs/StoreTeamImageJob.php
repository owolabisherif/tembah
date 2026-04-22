<?php

namespace App\Jobs;

use App\Models\Country;
use App\Models\Team;
use ArPHP\I18N\Arabic;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use PHPUnit\Framework\Constraint\Count;

class StoreTeamImageJob implements ShouldQueue
{
    use Queueable;

    private array $newTeams;

    /**
     * Create a new job instance.
     */
    public function __construct(private array $teams)
    {
        $now = now()->format("y-m-d");

    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {

            if(empty($this->teams)) return;

            $key =  env("GOAL_SERVE_KEY");
            $endPoint = env("GOAL_SERVE_ENDPOINT");
            $teamToStore = [];

            foreach ($this->teams as $t) {

                $team = Team::whereTeamId($t)->first();
    
                $req = Http::get("{$endPoint}/{$key}/soccerstats/team/$t?json=1");
                $collection = $req->collect();
        
                $teamCollection = @$collection["teams"]["team"];
                
                if(!$team) {
                    $this->newTeams[] = $teamCollection;
                    continue;
                }
    
                if ($team->image != null && $team->image != "") {
                    Log::info("DONE: {$t}");
                    continue;
                }

                $venuePath = "assets/images/venues/{$t}.jpeg";
                $imagePath = "assets/images/teams/{$t}.jpeg";

                $venueImage = @$teamCollection["venue_image"] ? base64ToImage($teamCollection["venue_image"], public_path($venuePath)) : null;
                $teamImage = @$teamCollection["image"] ? base64ToImage($teamCollection["image"], public_path($imagePath)) : null;
    
                $venue_image = $venueImage ? url($venuePath) : null;
                $image = $teamImage ? url($imagePath) : null;

                $teamToStore[] = [
                    "team_id" => $team->id,
                    "country_id" => $team->country_id,
                    "is_women" => $team->is_women,
                    "is_national_team" => $team->is_national_team,
                    "slug" => $team->slug,
                    "slug_ar" => $team->slug_ar,
                    "name" => $team->name,
                    "name_ar" => $team->name_ar,
                    "fullname" => $team->fullname,
                    "fullname_ar" => $team->fullname_ar,
                    "founded" => $team->founded,
                    "founded_ar" => $team->founded_ar,
                    "leagues" => $team->leagues,
                    "venue_name" => $team->venue_name,
                    "venue_name_ar" => $team->venue_name_ar,
                    "venue_id" => $team->venue_id,
                    "venue_surface" => $team->venue_surface,
                    "venue_address" => $team->venue_address,
                    "venue_city" => $team->venue_city,
                    "venue_capacity" => $team->venue_capacity,
                    "venue_capacity_ar" => $team->venue_capacity_ar,
                    "venue_image" => $venue_image,
                    "image" => $image,
                    "squad" => $team->squad,
                    "coach" => $team->coach,
                    "transfers" => $team->transfers,
                    "statistics" => $team->statistics,
                    "detailed_stats" => $team->detailed_stats,
                    "sidelined" => $team->sidelined,
                    "trophies" => $team->trophies,
                    "reload" => 0
                ];
            }

            $this->runUpsert($teamToStore);

            $this->addTeam();
        } catch (\Exception $e) {
            Log::info($e);
        }
    }


    private function addTeam() {
        $teamToStore = [];

        if(empty($this->newTeams)) return;

        foreach ($this->newTeams as $newTeam) {
            if(!$newTeam) {
                continue;
            }
            
            $arabic = new Arabic();
            $country = Country::where(["name" => Str::lower($newTeam["country"])])->first();
    
            if(!$country) continue;

            if(!@$newTeam['@id']) {
                Log::info($newTeam);
                continue;
            }
    
            $venueImage = @$newTeam["venue_image"] ? base64ToImage($newTeam["venue_image"], public_path("assets/images/venues/{$newTeam['@id']}.jpeg")) : null;
            $teamImage = @$newTeam["image"] ? base64ToImage($newTeam["image"], public_path("assets/images/teams/{$newTeam['@id']}.jpeg")) : null;

            try {
                $nameAr = $arabic->en2ar(@$newTeam["name"]);
                $fullnameAr = $arabic->en2ar(@$newTeam["fullname"]);
                $foundedAr = $arabic->en2ar(@$newTeam["founded"]);
                $venueNameAr = $arabic->en2ar(@$newTeam["venue_name"]);
                $venueCapacityAr = $arabic->en2ar(@$newTeam["venue_capacity"]);
            } catch (\Throwable $th) {
                $nameAr = @$newTeam["name"];
                $fullnameAr = @$newTeam["fullname"];
                $foundedAr = @$newTeam["founded"];
                $venueNameAr = @$newTeam["venue_name"];
                $venueCapacityAr = @$newTeam["venue_capacity"];
            }

            $teamToStore[] = [
                "team_id" => $newTeam['@id'],
                "country_id" => $country->id,
                "is_women" => (bool) @$newTeam["@is_women"] == "" ? false : (@$newTeam["@is_women"] == "False" ? false : true),
                "is_national_team" => (bool) $newTeam["@is_national_team"] == "" ? false : (@$newTeam["@is_national_team"] == "False" ? false : true),
                "slug" => makeSlug(new Team(), @$newTeam["name"]),
                "slug_ar" => makeSlug(new Team(), $nameAr, 'slug_ar'),
                "name" => @$newTeam["name"],
                "name_ar" => $nameAr,
                "fullname" => @$newTeam["fullname"],
                "fullname_ar" => $fullnameAr,
                "founded" => @$newTeam["founded"],
                "founded_ar" => $foundedAr,
                "leagues" => json_encode(@$newTeam["leagues"]),
                "venue_name" => @$newTeam["venue_name"],
                "venue_name_ar" => $venueNameAr,
                "venue_id" => @$newTeam["venue_id"],
                "venue_surface" => @$newTeam["venue_surface"],
                "venue_address" => json_encode(@$newTeam["venue_address"]),
                "venue_city" => json_encode(@$newTeam["venue_city"]),
                "venue_capacity" => @$newTeam["venue_capacity"],
                "venue_capacity_ar" => $venueCapacityAr,
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
        }

        $this->runUpsert($teamToStore);
    }

    private function runUpsert($teamToStore) {
        $colsToUpdate = [
            "team_id",
            "country_id",
            "is_women",
            "is_national_team",
            "slug",
            "slug_ar",
            "name",
            "name_ar",
            "fullname",
            "fullname_ar",
            "founded",
            "founded_ar",
            "leagues",
            "venue_name",
            "venue_name_ar",
            "venue_id",
            "venue_surface",
            "venue_address",
            "venue_city",
            "venue_capacity",
            "venue_capacity_ar",
            "venue_image",
            "image",
            "squad",
            "coach",
            "transfers",
            "statistics",
            "detailed_stats",
            "sidelined",
            "trophies",
            "reload"
        ];

        Team::upsert($teamToStore, ["team_id"], $colsToUpdate);
    }
}
