<?php

namespace App\Transformers;

use App\Models\Team;
use Carbon\Carbon;
use Illuminate\Support\Str;
use League\Fractal\TransformerAbstract;

class LeagueFixtureCustomTransformer extends TransformerAbstract
{
    public $season;
    private $fixtures = array();
    private $badFixtures = array();

    public function __construct($season)
    {
        $this->season = $season;
    }

    public function getFixtures(array $data)
    {
        $allFixtures = array();

        if (@$data["results"]["tournament"] && array_key_exists('stage', @$data["results"]["tournament"])) {

            $getWeekInStage = @$data["results"]["tournament"]["stage"]["week"];

            if ($getWeekInStage) {
                foreach ($getWeekInStage as $stages) {
                    if(@$stages["match"]["@date"]) {
                        $this->handleBadData($stages["match"]);
                    } else {
                        $allFixtures = [...$allFixtures, ...$stages["match"]];
                    }
                }
            } else {
                
                foreach (@$data["results"]["tournament"]["stage"] as $stages) {
                    if (@$stages["match"]["@date"]) {
                        $this->handleBadData($stages["match"]);
                    } elseif(array_key_exists("week", $stages)) {
                        foreach ($stages["week"] as $week) {
                            if (@$week["match"]["@date"]) {
                                $this->handleBadData($week["match"]);
                            } else {
                                $allFixtures = [...$allFixtures, ...$week["match"]];
                            }
                        }
                    } elseif (array_key_exists("aggregate", $stages)) {
                        $allFixtures = [...$allFixtures, ...$stages["aggregate"]["match"]];
                    } else {
                        $allFixtures = [...$allFixtures, ...$stages["match"]];
                    }
                }
            }
        } else {

            foreach (@$data["results"]["tournament"]["week"] as $weeks) {
                if(@$weeks["match"]["@date"]) {
                    $this->handleBadData($weeks["match"]);
                } else {
                    $allFixtures = [...$allFixtures, ...$weeks["match"]];
                }
            }
        }

        $allFixtures = [...$allFixtures, ...$this->badFixtures];

        $allFixtures = array_filter($allFixtures, fn($game) => is_array($game));

        $allFixtures = array_filter($allFixtures, fn($game) => array_key_exists("@date", $game));

        $this->transform($allFixtures);

        return $this;
    }

    private function handleBadData($data) {
        array_push($this->badFixtures, [
            "@date" => @$data["@date"],
            "@time" => @$data["@time"],
            "@status" => @$data["@status"],
            "@venue" => @$data["@venue"],
            "@venue_id" => @$data["@venue_id"],
            "@venue_city" => @$data["@venue_city"],
            "@attendance" => @$data["@attendance"],
            "@static_id" => @$data["@static_id"],
            "@id" => @$data["@id"],
            "goals" => @$data["goals"],
            "localteam" => @$data["localteam"],
            "visitorteam" => @$data["visitorteam"],
            "halftime" => @$data["halftime"],
            "lineups" => @$data["lineups"],
            "substitutions" => @$data["substitutions"],
            "coaches" => @$data["coaches"],
            "referee" => @$data["referee"],
        ]);
    }

    /**
     * A Fractal transformer.
     *
     * @return array
     */
    private function transform(?array $fixtures)
    {
        $matches = [];

        if (count($fixtures)) {
            $userTz = @getUserLocation()?->time_zone?->name ?? 'Asia/Qatar';
            foreach ($fixtures as $match) {
                $localHasLogo = Team::whereTeamId(@$match["localteam"]["@id"])->first(["image"]);
                $visitorHasLogo = Team::whereTeamId(@$match["visitorteam"]["@id"])->first(["image"]);

                $dateString = explode(".", @$match["@date"]);

                $next = Carbon::create($dateString[2], $dateString[1], $dateString[0], 0, 0, 0, $userTz);
                $now = Carbon::create(now()->year, now()->month, now()->day, 0, 0, 0, $userTz);

                $sort = Carbon::parse(@$match['@date'] . " " . @$match["@time"])->setTimezone($userTz)->timestamp;
                
                array_push($matches, [
                    "date" => Carbon::parse(@$match["@date"])->setTimezone($userTz)->format("M d, Y"),
                    "isNext" => $next->gte($now),
                    "time" => Carbon::parse(@$match["@time"])->setTimezone($userTz)->format("h:i A"),
                    "sort" => $sort,
                    "status" => @$match["@status"],
                    "venue" => @$match["@venue"],
                    "venueCity" => @$match["@venue_city"],
                    "attendance" => @$match["@attendance"],
                    "homeTeam" => [
                        "slug" => Str::slug(@$match["localteam"]["@name"]),
                        "teamId" => @$match["localteam"]["@id"],
                        "logo" => @$localHasLogo->image ?? null,
                        "name" => @$match["localteam"]["@name"],
                        "score" => (int) @$match["localteam"]["@score"],
                        "ftScore" => (int) @$match["localteam"]["@ft_score"],
                        "etScore" => (int) @$match["localteam"]["@et_score"],
                        "penScore" => (int) @$match["localteam"]["@pen_score"],
                    ],
                    "awayTeam" => [
                        "slug" => Str::slug(@$match["visitorteam"]["@name"]),
                        "teamId" => @$match["visitorteam"]["@id"],
                        "logo" => @$visitorHasLogo->image ?? null,
                        "name" => @$match["visitorteam"]["@name"],
                        "score" => (int) @$match["visitorteam"]["@score"],
                        "ftScore" => (int) @$match["visitorteam"]["@ft_score"],
                        "etScore" => (int) @$match["visitorteam"]["@et_score"],
                        "penScore" => (int) @$match["visitorteam"]["@pen_score"],
                    ]
                ]);
            }
        }

        usort($matches, fn($a, $b) => $a["sort"] <=> $b["sort"]);

        $this->fixtures = [
            "id" => 0,
            "week" => 0,
            "season" => $this->season,
            "matches" => $matches,
        ];
    }


    public function result(): array {
        return $this->fixtures;
    }
}
