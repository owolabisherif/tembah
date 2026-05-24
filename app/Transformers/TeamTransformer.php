<?php

namespace App\Transformers;

use App\Jobs\StorePlayerJob;
use App\Models\Player;
use App\Models\Team;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use League\Fractal\TransformerAbstract;

class TeamTransformer extends TransformerAbstract
{
    /**
     * List of resources to automatically include
     *
     * @var array
     */
    protected array $defaultIncludes = [
        //
    ];
    
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected array $availableIncludes = [
        //
    ];
    
    /**
     * A Fractal transformer.
     *
     * @return array
     */
    public function transform(Team $team)
    {
        return [
            "id" => $team->id,
            "teamId" => (int) $team->team_id,
            "countryId" => $team->country_id,
            "country" => @$team->country->name ?? $team->name,
            "countryAr" => @$team->country->name_ar ?? $team->name_ar,
            "isWomen" => (bool) $team->country_id,
            "isNationalTeam" => (bool) $team->is_national_team,
            "slug" => $team->slug,
            "slugAr" => $team->slug_ar,
            "name" => $team->name,
            "nameAr" => $team->name_ar,
            "fullname" => $team->fullname,
            "fullnameAr" => $team->fullname_ar,
            "founded" => $team->founded,
            "foundedAr" => $team->founded_ar, 
            "leagues" => gettype($team->leagues) == 'string' && $team->leagues != "null" ? json_decode($team->leagues) : $team->leagues,
            "venueName" => $team->venue_name,
            "venueNameAr" => $team->venue_name_ar,
            "venueId" => $team->venue_id,
            "venueSurface" => $team->venue_surface,
            "venueAddress" => gettype($team->venue_address) == 'string' && $team->venue_address != "null" ? json_decode($team->venue_address) : $team->venue_address,
            "venueCity" =>  gettype($team->venue_city) == 'string' && $team->venue_city != "null" ? json_decode($team->venue_city) : $team->venue_city,
            "venueCapacity" => $team->venue_capacity,
            "venueCapacityAr" => $team->venue_capacity_ar,
            "venueImage" => $team->venue_image,
            "image" => $team->image,
            "squad" =>  gettype($team->squad) == 'string' && $team->squad != "null" ? $this->transformSquad(json_decode($team->squad)) : $this->transformSquad($team->squad),
            "coach" => gettype($team->coach) == 'string' && $team->coach != "null" ? $this->transformCoach(json_decode($team->coach)) : $this->transformCoach($team->coach),
            "transfers" => gettype($team->transfers) == 'string' && $team->transfers != "null" ? json_decode($team->transfers) : $team->transfers,
            "statistics" => gettype($team->statistics) == 'string' && $team->statistics != "null" ? json_decode($team->statistics) : $team->statistics,
            "detailedStats" => gettype($team->detailed_stats) == 'string' && $team->detailed_stats != "null" ? json_decode($team->detailed_stats) : $team->detailed_stats,
            "sidelined" => gettype($team->sidelined) == 'string' && $team->sidelined != "null" ? json_decode($team->sidelined) : $team->sidelined,
            "trophies" => gettype($team->trophies) == 'string' && $team->trophies != "null" ? json_decode($team->trophies) : $team->trophies,
            "reload" => $team->reload
        ];
    }


    private function transformCoach($coach) {
        if(!$coach || $coach == null || $coach == 'null') return null;

        $coach = (array) $coach;

        $player = Player::where("player_id", $coach["@id"])->first();

        return [
            "id" => $coach["@id"],
            "name" => $coach["@name"],
            "nameAr" => getArabic($coach["@name"]),
            "slug" => Str::slug($coach["@name"]),
            "age" => (int) @$player->age,
            "position" => @$player->position,
            "shirt" => @$player->shirt,
            "nationality" => @$player->nationality,
            "height" => @$player->height,
            "image" => @$player->image,
            "countryFlag" => getCountryFlag(@$player->nationality ?? ""),
            "transferValue" => @$player->market_value
        ];
    }


    private function transformSquad($squad) {
        if(!$squad || $squad == null || $squad == 'null') return [];
        
        $squad = (array) $squad->player;

        $playerIds = collect($squad)->map(fn($player) => $player->{"@id"})->values()->toArray();
        
        $storedPlayers = Player::whereIn("player_id", $playerIds)->get();

        return collect($squad)->map(function($player) use ($storedPlayers) {

            $pl = null;

            if($storedPlayers->count()) {
                $pl = $storedPlayers->first(fn($item) => $item->player_id == $player->{"@id"});
            }

            if(!$pl) StorePlayerJob::dispatch($player->{"@id"}, $player->{"@number"});

            return  [
                "id" => $player->{"@id"},
                "name" => $player->{"@name"},
                "nameAr" => getArabic($player->{"@name"}),
                "slug" => Str::slug($player->{"@name"}),
                "age" => (int) $player->{"@age"},
                "position" => $player->{"@position"},
                "shirt" => (int) $player->{"@number"},
                "nationality" => @$pl->nationality,
                "nationalityAr" => getArabic(@$pl->nationality),
                "height" => @$pl->height,
                "image" => @$pl->image,
                "countryFlag" => getCountryFlag(@$pl->nationality ?? ""),
                "transferValue" => @$pl->market_value
            ];
        });
    }
}
