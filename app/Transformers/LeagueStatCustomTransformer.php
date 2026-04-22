<?php

namespace App\Transformers;

use League\Fractal\TransformerAbstract;
use App\Models\Team;
use Carbon\Carbon;
use stdClass;

class LeagueStatCustomTransformer extends TransformerAbstract
{
    private  $season;
    private  $goals = [];
    private  $assists = [];
    private  $goalsPlusAssists = [];
    private $badFixtures = array();

    public function __construct($season)
    {
        $this->season = $season;
    }

    public function getStats($data)
    {

        if(count($data) == 0) {
            return $this;
        };

        $allFixtures = array();

        if (@$data["results"]["tournament"] && array_key_exists('stage', @$data["results"]["tournament"])) {
            $getWeekInStage = @$data["results"]["tournament"]["stage"]["week"];

            if ($getWeekInStage) {
                foreach ($getWeekInStage as $stages) {
                    if (@$stages["match"]["@date"]) {
                        $this->handleBadData($stages["match"]);
                    } else {
                        $allFixtures = [...$allFixtures, ...$stages["match"]];
                    }
                }
            } else {
                foreach (@$data["results"]["tournament"]["stage"] as $stages) {
                    if (@$stages["match"]["@date"]) {
                        $this->handleBadData($stages["match"]);
                    } elseif (array_key_exists("week", $stages)) {
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
                if (@$weeks["match"]["@date"]) {
                    $this->handleBadData($weeks["match"]);
                } else {
                    $allFixtures = [...$allFixtures, ...$weeks["match"]];
                }
            }
        }

        $this->transform($allFixtures);

        return $this;
    }

    private function handleBadData($data)
    {
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
    
    private function transform(array $fixtures)
    {
        $badData = array();
        $goodData = array();
        $statistics = array();

        if (count($fixtures)) {
            $userTz = @getUserLocation()?->time_zone?->name ?? "Asia\Qatar";
            foreach (@$fixtures as $match) {
                $localHasLogo = Team::whereTeamId(@$match["localteam"]["@id"])->first(["image"]);
                $visitorHasLogo = Team::whereTeamId(@$match["visitorteam"]["@id"])->first(["image"]);

                $type = gettype($match);

                if ($type == 'array' && @$match["goals"] != null) {
                    foreach(@$match["goals"] as $index => $goals) {
                        if(is_array($goals)) {
                            foreach($goals as $index => $statItem) {
                                $statItemType = gettype($statItem);
                                
                                if($statItemType == "array") {
                                    array_push($goodData, [...$statItem, 
                                        "@localteamid" => @$match["localteam"]["@id"], 
                                        "@visitorteamid" => @$match["visitorteam"]["@id"],
                                        "@localteamname" => @$match["localteam"]["@name"],
                                        "@visitorteamname" => @$match["visitorteam"]["@name"],
                                        "@localteamlogo" => @$localHasLogo->image ?: null,
                                        "@visitorteamlogo" => @$visitorHasLogo->image ?: null,
                                    ]);
                                } 
                            }
                        }
                    }
                }

                
                array_push($badData, [
                    "@localteamid" => @$match["localteam"]["@id"],
                    "@visitorteamid" => @$match["visitorteam"]["@id"],
                    "@localteamname" => @$match["localteam"]["@name"],
                    "@visitorteamname" => @$match["visitorteam"]["@name"],
                    "@localteamlogo" => @$localHasLogo->image ?: null,
                    "@visitorteamlogo" => @$visitorHasLogo->image ?: null,
                    "@player" => @$match["goals"]["goal"]["@player"],
                    "@team" => @$match["goals"]["goal"]["@team"],
                    "@minute" => @$match["goals"]["goal"]["@minute"],
                    "@score" => @$match["goals"]["goal"]["@score"],
                    "@playerid" => @$match["goals"]["goal"]["@playerid"],
                    "@assist" => @$match["goals"]["goal"]["@assist"],
                    "@assistid" => @$match["goals"]["goal"]["@assistid"]
                ]);
            }
        }

        $badData = array_filter($badData, fn($data) =>  $data["@player"] != null);

        $statistics = [...$goodData, ...$badData];

        foreach ($statistics as $data) {
            $this->handleStat($data);
        }

        $this->getGoalsPlusAssists();

        return $this;
    }

    private function handleStat($data) {
        if (array_key_exists($data["@playerid"], $this->goals)) {
            $this->goals[$data["@playerid"]]["value"]++;
        } else {
            $this->goals[$data["@playerid"]] = [
                "player" => [
                    "id" => (int) $data["@playerid"],
                    "name" => $data["@player"],
                    "image" => null
                ],
                "team" => [
                    "id" => $data["@team"] == 'visitorteam' ? (int) @$data["@visitorteamid"] : (int) @$data["@localteamid"],
                    "name" => $data["@team"] == 'visitorteam' ? @$data["@visitorteamname"] : @$data["@localteamname"],
                    "logo" =>  $data["@team"] == 'visitorteam' ? @$data["@visitorteamlogo"] : @$data["@localteamlogo"],
                ],
                "value" => 1
            ];
        }

        if($data["@assist"] != "") {
            if (array_key_exists($data["@assistid"], $this->assists)) {
                $this->assists[$data["@assistid"]]["value"]++;
            } else {
                $this->assists[$data["@assistid"]] = [
                    "player" => [
                        "id" => (int) $data["@assistid"],
                        "name" => $data["@assist"],
                        "image" => null
                    ],
                    "team" => [
                        "id" => $data["@team"] == 'visitorteam' ? (int) @$data["@visitorteamid"] : (int) @$data["@localteamid"],
                        "name" => $data["@team"] == 'visitorteam' ? @$data["@visitorteamname"] : @$data["@localteamname"],
                        "logo" =>  $data["@team"] == 'visitorteam' ? @$data["@visitorteamlogo"] : @$data["@localteamlogo"],
                    ],
                    "value" => 1
                ];
            }
        }
    }

    private function getGoalsPlusAssists()
    {
        if (count($this->goals) > 0 && count($this->assists) > 0) {
            foreach ($this->goals as $key => $item) {
                $playerAssist = @$this->assists[$key]["value"] ?? 0;

                $this->goalsPlusAssists[$key] = [
                    "player" => [
                        "id" => $item["player"]["id"],
                        "name" => $item["player"]["name"],
                        "image" => $item["player"]["image"]
                    ],
                    "team" => [
                        "id" => $item["team"]["id"],
                        "name" => $item["team"]["name"],
                        "logo" =>  $item['team']["logo"],
                    ],
                    "value" => $playerAssist + $item["value"]
                ];
            }
        }
    }

    public function result(): array
    {
        usort($this->goals, function ($a, $b) {
            return $b["value"] <=> $a["value"];
        });

        usort($this->assists, function ($a, $b) {
            return $b["value"] <=> $a["value"];
        });
        
        usort($this->goalsPlusAssists, function ($a, $b) {
            return $b["value"] <=> $a["value"];
        });
        
        return [
            "season" => $this->season,
            "goals" => $this->goals,
            "assists" => $this->assists,
            "goalsPlusAssists" =>  $this->goalsPlusAssists
        ];
    }
}
