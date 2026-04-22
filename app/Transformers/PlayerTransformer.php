<?php

namespace App\Transformers;

use App\Models\Player;
use App\Models\Team;
use ArPHP\I18N\Arabic;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use League\Fractal\TransformerAbstract;
use Money\Parser\AggregateMoneyParser;
use Money\Parser\IntlMoneyParser;
use Money\Currencies\ISOCurrencies;



class PlayerTransformer extends TransformerAbstract
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
    public function transform(Player $player)
    {
        $ar = new Arabic();

        $transfers = json_decode($player->transfers);
        $stats = json_decode($player->statistic);
        $overallStats = json_decode($player->overall_clubs);
        $trophies = json_decode($player->trophies);

        Log::info(json_encode($stats));

        return [
            "playerId" => $player->player_id,
            "teamId" => $player->team_id,
            "nationalTeamId" => $player->national_team_id,
            "slug" => $player->slug,
            "slugAr" => $player->slug_ar,
            "name" => $player->name,
            "nameAr" => $player->name_ar,
            "commonName" => $player->common_name,
            "commonNameAr" => $player->common_name_ar,
            "fullname" => $player->fullname,
            "fullnameAr" => $player->fullname_ar,
            "firstname" => $player->firstname,
            "firstnameAr" => $player->firstname_ar,
            "lastname" => $player->lastname,
            "lastnameAr" => $player->lastname_ar,
            "nationality" => $player->nationality,
            "nationalityAr" => $player->nationality_ar,
            "birthCountry" => $player->birth_country,
            "birthCountryAr" => $player->birth_country_ar,
            "birthCountryFlag" => getCountryFlag($player->birth_country),
            "birthPlace" => $player->birth_place,
            "birthPlaceAr" => $player->birth_place_ar,
            "birthDate" => Carbon::parse($player->birthdate)->format("M d, Y"),
            "birthDateAr" => $ar->date("M d, Y", Carbon::parse($player->birthdate)->timestamp),
            "position" => $player->position,
            "positionAr" => $player->position_ar,
            "shirt" => $player->shirt,
            "shirtAr" => $player->shirt_ar,
            "shirt" => $player->shirt,
            "shirtAr" => $player->shirt_ar,
            "preferredFoot" => $player->preferred_foot,
            "preferredFootAr" => $player->preferred_foot_ar,
            "marketValue" => $player->market_value,
            "age" => $player->age,
            "ageAr" => $player->age_ar,
            "height" => $player->height,
            "heightAr" => $player->height_ar,
            "weight" => $player->weight,
            "weightAr" => $player->weight,
            "image" => $player->image,
            "team" => $player->team,
            "teamFlag" => $player->team_flag,
            "teamAr" => $player->team_ar,
            "statistic" => $this->getStats(@$stats->{"club"}),
            "statisticCups" => json_decode(@$player->statistic_cups),
            "statisticCupsIntl" => json_decode($player->statistic_cups_intl),
            "transfers" => $this->getTransfer(@$transfers->transfer),
            "trophies" => $this->getTrophies(@$trophies->{"trophy"}),
            "overallClubStats" => $this->getStats(@$overallStats->stats, 'all'),
            "overallClubs" => @$overallStats->stats,
            "reload" => $player->reload,
        ];
    }

    private function getTrophies($trophies) {
        if(!$trophies) return [];

        if(@$trophies->{"@league"}) {
            return [
                "count" => (int) @$trophies->{"@count"},
                "league" => @$trophies->{"@league"},
                "seasons" => explode(",", @$trophies->{"@seasons"}),
            ];
        }

        foreach ($trophies as $trophy) {
            $data[] = [
                "count" => (int) $trophy->{"@count"},
                "league" => $trophy->{"@league"},
                "seasons" => explode(",", $trophy->{"@seasons"}),
            ];
        }

        return collect($data)->sortBy("count")->values();
    }

    private function getTransfer($transfers) {
        $numberFormatter = new \NumberFormatter('en_US', \NumberFormatter::CURRENCY);
        $currencies = new ISOCurrencies();
        $intlParser = new IntlMoneyParser($numberFormatter, $currencies);
        $moneyParser = new AggregateMoneyParser([$intlParser]);
        $data = [];


        if(!$transfers) return $data;

        $teamArray = [];

        foreach ($transfers as $transfer) {
            $teamArray = [$transfer->{"@from_id"}, $transfer->{"@to_id"}, ...$teamArray];
        }
            
        $teams = Team::whereIn("team_id", $teamArray)->get(["team_id","image"]);

        foreach ($transfers as $transfer) {
            $fromTeamImage = $teams->first(fn($value) => $value->team_id == $transfer->{"@from_id"});
            $toTeamImage = $teams->first(fn($value) => $value->team_id == $transfer->{"@to_id"});


            $price = str_replace("EUR ", "", $transfer->{"@price"});
            $price = str_replace("EUR", "", $price);

            $keys = [
                "k" => "000",
                "m" => "000000",
                "b" => "000000000",
                "t" => "000000000000"
            ];

            if($price != '') {
                $priceKeyArray = str_split($price);
                $key = $priceKeyArray[count($priceKeyArray) - 1];
                
                $zeros = $this->fixZeros($price, $key);

                $price = str_replace("0".$key, $keys[$key], $price);
                $price = str_replace($key, $zeros, $price);
                $price = str_replace(".", "", $price);
            }

            $data[] = [
                "year" => Carbon::parse($transfer->{"@date"})->format("Y"),
                "price" => $price,
                "type" => @$transfer->{"@type"},
                "from" => [
                    "id" => @$transfer->{"@from_id"},
                    "name" => @$transfer->{"@from"},
                    "image" => @$fromTeamImage->image,
                ],
                "to" => [
                    "id" => @$transfer->{"@to_id"},
                    "name" => @$transfer->{"@to"},
                    "image" => @$toTeamImage->image,
                ],
            ];
        }


        return collect($data)->sortBy('year')->values()->toArray();
    }

    private function fixZeros($money, $key) {
        $zeros = "";

        $price = str_replace($key, "", $money);

        $priceArray = explode(".", $price);

        $isZero = (int) $priceArray[count($priceArray) - 1];

        $mul = [
            "k" => 3,
            "m" => 6,
            "b" => 9,
            "t" => 12,
        ];

        $numberofZeros = $isZero > 0 ? $mul[$key] - 1 : $mul[$key];

        for ($i=0; $i < $numberofZeros; $i++) { 
           $zeros .= "0";
        }

        return $zeros;
    }

    private function getStats($stat, $type= "current") {
        if(!$stat) return [];

        if(!@$stat->{"@id"} && $type == 'current') {
            $stat = (object) $stat[0];
        }


        try {
           $rating = round($stat->{"@rating"}, 2);
        } catch (\Throwable $th) {
            $rating = 0;
        }

        if($type == 'current') {
            return [
                "leagueId" => (int) @$stat->{"@league_id"},
                "league" =>  @$stat->{"@league"},
                "season" =>  @$stat->{"@season"},
                "goals" => (int) @$stat->{"@goals"},
                "assist" => (int) @$stat->{"@assists"},
                "keyPasses" => (int) @$stat->{"@keyPasses"},
                "matches" => (int) @$stat->{"@appearences"},
                "minutesPlayed" => (int) @$stat->{"@minutes"},
                "rating" =>@ $rating,
                "yellow" => (int) @$stat->{"@yellowcards"},
                "red" => (int) @$stat->{"@redcards"}
            ];
        }

        return [
            "shots" => (int) @$stat->{"@shotsTotal"},
            "dribbles" => (int) @$stat->{"@dribbleSucc"},
            "assist" => (int) @$stat->{"@assists"},
            "passes" => (int) @$stat->{"@passes"},
            "keyPasses" => (int) @$stat->{"@keyPasses"},
            "matches" => (int) @$stat->{"@appearences"},
            "minutesPlayed" => (int) @$stat->{"@minutesPlayed"},
            "rating" => @$rating,
            "penScored" => (int) @$stat->{"@penScored"},
            "tackles" => (int) @$stat->{"@tackles"}
        ];
    }
}
