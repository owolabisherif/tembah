<?php

namespace App\Transformers;

use League\Fractal\TransformerAbstract;
use App\Models\Team;
use Carbon\Carbon;

class LeagueStatTransformer extends TransformerAbstract
{
    public  $season;
    public  $goals = [];
    public  $assists = [];
    public function __construct($season)
    {
        $this->season = $season;
    }

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
    public function transform($fixture)
    {
        if (count(@$fixture["match"])) {
            // return ["goals" => @$fixture["match"][0]["goals"]];

            // $userTz = getUserLocation()?->time_zone?->name;

            foreach (@$fixture["match"] as $match) {
                $type = gettype($match);

                if ($type == 'array' && @$match["goals"] != null) {
                    $localHasLogo = Team::whereTeamId(@$match["localteam"]["@id"])->first(["image"]);
                    $visitorHasLogo = Team::whereTeamId(@$match["visitorteam"]["@id"])->first(["image"]);

                    foreach(@$match["goals"] as $goal) {
                        $goalType = gettype($goal);
                        if($goalType == 'array') {
                            foreach($goal as $statItem) {
                                $statItemType = gettype($statItem);
                                if($statItemType == "array") {
                                    $logo = $statItem["@team"] == 'visitorteam' ? (@$visitorHasLogo->image ?: "") : (@$localHasLogo->image ?: "");
                                    $this->handleStat($statItem, $match, $logo);
                                } else {
                                    $logo = $goal["@team"] == 'visitorteam' ? (@$visitorHasLogo->image ?: "") : (@$localHasLogo->image ?: "");
                                    $this->handleStat($goal, $match, $logo);
                                }
                            }
                        }
                    }
                }
            }
        }

        usort($this->goals, function($a, $b) {
            return $b["scored"] <=> $a["scored"];
        });

        usort($this->assists, function($a, $b) {
            return $b["assisted"] <=> $a["assisted"];
        });

        return [
            "season" => $this->season,
            "goals" => $this->goals,
            "assists" => $this->assists
        ];
    }

    private function handleStat($data, $match, $logo) {
        if (array_key_exists($data["@playerid"], $this->goals)) {
            $this->goals[$data["@playerid"]]["scored"]++;
        } else {
            $this->goals[$data["@playerid"]] = [
                "player" => [
                    "id" => (int) $data["@playerid"],
                    "name" => $data["@player"],
                    "image" => ""
                ],
                "team" => [
                    "id" => $data["@team"] == 'visitorteam' ? (int) @$match["visitorteam"]["@id"] : (int) @$match["localteam"]["@id"],
                    "name" => $data["@team"] == 'visitorteam' ? @$match["visitorteam"]["@name"] : @$match["localteam"]["@name"],
                    "logo" => $logo,
                ],
                "scored" => 1
            ];
        }

        if($data["@assist"] != "") {
            if (array_key_exists($data["@assistid"], $this->assists)) {
                $this->assists[$data["@assistid"]]["assisted"]++;
            } else {
                $this->assists[$data["@assistid"]] = [
                    "player" => [
                        "id" => (int) $data["@assistid"],
                        "name" => (int) $data["@assist"],
                        "image" => ""
                    ],
                    "team" => [
                        "id" => $data["@team"] == 'visitorteam' ? (int) @$match["visitorteam"]["@id"] : (int) @$match["localteam"]["@id"],
                        "name" => $data["@team"] == 'visitorteam' ? (int) @$match["visitorteam"]["@name"] : (int) @$match["localteam"]["@name"],
                        "logo" => $logo,
                    ],
                    "assisted" => 1
                ];
            }
        }
    }
}
