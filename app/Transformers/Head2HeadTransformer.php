<?php

namespace App\Transformers;

use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use League\Fractal\TransformerAbstract;

class Head2HeadTransformer
{
    /**
     * A Fractal transformer.
     *
     * @return array
     */
    public static function transform($head2head)
    {
        $head2head = (object) $head2head;

        $biggestDefeat1 = (object) self::getBiggestDeafeat($head2head, "team1");
        $biggestDefeat2 =  (object) self::getBiggestDeafeat($head2head, "team2");
        $biggestVictory1 = (object) self::getBiggestVictory($head2head, "team1");
        $biggestVictory2 =  (object) self::getBiggestVictory($head2head, "team2");
        $awayGoals = (object) self::getGoals($head2head, "away");
        $homeGoals = (object) self::getGoals($head2head, "home");
        $totalGoals = (object) self::getGoals($head2head, "total");
        $last5away1 = (object) self::last5away($head2head, "team1");
        $last5away2 = (object) self::last5away($head2head, "team2");
        $overall1 = (object) self::getOverall($head2head, "away", "team1");
        $overall2 = (object) self::getOverall($head2head,"home", "team2");
        $top50s = (object) self::top50($head2head, "top50");


        return [
            "x" => $head2head,
            "homeTeam" => [
                "id" => $head2head->{"@team1"},
                "biggestDeafeat" => count(get_object_vars($biggestDefeat1)) != 0 ? [
                    "date" => $biggestDefeat1->{"@date"},
                    "category" => $biggestDefeat1->{"@category"},
                    "leagueId" => $biggestDefeat1->{"@league_id"},
                    "staticId" => $biggestDefeat1->{"@static_id"},
                    "homeScore" => $biggestDefeat1->{"@team1_score"},
                    "awayScore" => $biggestDefeat1->{"@team2_score"},
                ] : null,
                "biggestVictory" => count(get_object_vars($biggestVictory1)) != 0 ? [
                    "date" => $biggestVictory1->{"@date"},
                    "category" => $biggestVictory1->{"@category"},
                    "leagueId" => $biggestVictory1->{"@league_id"},
                    "staticId" => $biggestVictory1->{"@static_id"},
                    "homeScore" => $biggestVictory1->{"@team1_score"},
                    "awayScore" => $biggestVictory1->{"@team2_score"},
                ] : null,
                "goals" => [
                    "homeScore" => collect(get_object_vars($homeGoals))[0]["@team1_scored"],
                    "homeConceded" => collect(get_object_vars($homeGoals))[1]["@team1_conceded"],
                    "awayScore" => collect(get_object_vars($homeGoals))[2]["@team2_scored"],
                    "awayConceded" => collect(get_object_vars($homeGoals))[3]["@team2_conceded"],
                ],
                "overall" => [
                    "goals" => get_object_vars($overall2)[0]["@games"],
                    "won" => get_object_vars($overall2)[1]["@won"],
                    "lost" => get_object_vars($overall2)[2]["@lost"],
                    "draws" => get_object_vars($overall2)[3]["@draws"],
                ],
                "last5away" => gettype($last5away1) == "object" ? [] :  collect($last5away1)->map(function ($value) use($last5away1) {
                    return [
                        "date" => @$value["@date"],
                        "category" => @$value["@category"],
                        "staticId" => @$value["@static_id"],
                        "leagueId" => @$value["@league_id"],
                        "leagueName" => @$value["@league"],
                        "teamOne" => [
                            "id" => @$value["@id1"],
                            "name" => @$value["@team1"],
                            "goal" => @$value["@team1_score"],
                        ],
                        "teamTwo" => [
                            "id" => @$value["@id2"],
                            "name" => @$value["@team2"],
                            "goal" => @$value["@team2_score"],
                        ],
                    ];
                })
            ],
            "awayTeam" => [
                "id" => $head2head->{"@team2"},
                "biggestDeafeat" => count(get_object_vars($biggestDefeat2)) != 0 ? [
                    "date" => $biggestDefeat2->{"@date"},
                    "category" => $biggestDefeat2->{"@category"},
                    "leagueId" => $biggestDefeat2->{"@league_id"},
                    "staticId" => $biggestDefeat2->{"@static_id"},
                    "homeScore" => $biggestDefeat2->{"@team1_score"},
                    "awayScore" => $biggestDefeat2->{"@team2_score"},
                ] : null,
                "biggestVictory" => count(get_object_vars($biggestVictory2)) != 0 ? [
                    "date" => $biggestVictory2->{"@date"},
                    "category" => $biggestVictory2->{"@category"},
                    "leagueId" => $biggestVictory2->{"@league_id"},
                    "staticId" => $biggestVictory2->{"@static_id"},
                    "homeScore" => $biggestVictory2->{"@team1_score"},
                    "awayScore" => $biggestVictory2->{"@team2_score"},
                ] : null,
                "goals" => [
                    "homeScore" => collect(get_object_vars($awayGoals))[0]["@team1_scored"],
                    "homeConceded" => collect(get_object_vars($awayGoals))[1]["@team1_conceded"],
                    "awayScore" => collect(get_object_vars($awayGoals))[2]["@team2_scored"],
                    "awayConceded" => collect(get_object_vars($awayGoals))[3]["@team2_conceded"],
                ],
                "overall" => [
                    "goals" => get_object_vars($overall1)[0]["@games"],
                    "won" => get_object_vars($overall1)[1]["@won"],
                    "lost" => @get_object_vars($overall1)[2]["@lost"],
                    "draws" => get_object_vars($overall1)[3]["@draws"],
                ],
                "last5away" => collect($last5away2)->map(function ($value) {
                    return [
                        "date" => $value["@date"],
                        "category" => $value["@category"],
                        "staticId" => $value["@static_id"],
                        "leagueId" => $value["@league_id"],
                        "leagueName" => $value["@league"],
                        "teamOne" => [
                            "id" => $value["@id1"],
                            "name" => $value["@team1"],
                            "goal" => $value["@team1_score"],
                        ],
                        "teamTwo" => [
                            "id" => $value["@id2"],
                            "name" => $value["@team2"],
                            "goal" => $value["@team2_score"],
                        ],
                    ];
                }),
            ],
            "top50s" => self::getTop50s($top50s),
            "totalGoals" => [
                "homeScore" => collect(get_object_vars(@$totalGoals))[0]["@team1_scored"],
                "homeConceded" => collect(get_object_vars(@$totalGoals))[1]["@team1_conceded"],
                "awayScore" => collect(get_object_vars(@$totalGoals))[2]["@team2_scored"],
                "awayConceded" => collect(get_object_vars(@$totalGoals))[3]["@team2_conceded"],
            ]
        ];
    }

    private static function getTop50s($top50s) {
        $data = [];


        if(@$top50s->{"@team1"} && @$top50s->{"@team2"}) {
            $data = [
                 [
                    "slug" => Str::slug(@$top50s->{"@team1"}) . "-vs-" . Str::slug(@$top50s->{"@team2"}) . "-" . @$top50s->{"@static_id"},
                    "country" => @$top50s->{"@category"},
                    "leagueId" => @$top50s->{"@league_id"},
                    "league" => @$top50s->{"@league"},
                    "staticId" => @$top50s->{"@static_id"},
                    "date" => Carbon::parse(@$top50s->{"@date"})->format("F j, Y"),
                    "homeTeam" => [
                        "id" => $top50s->{"@id1"},
                        "name" => $top50s->{"@team1"},
                        "score" => $top50s->{"@team1_score"},
                    ],
                    "awayTeam" => [
                        "id" => @$top50s->{"@id2"},
                        "name" => @$top50s->{"@team2"},
                        "score" => @$top50s->{"@team2_score"},
                    ],
                ]
            ];
        } else {
            $top50s = (array) $top50s;

            $data = collect($top50s)->map(function ($top50) {
                return [
                    "slug" => Str::slug(@$top50["@team1"]) . "-vs-" . Str::slug($top50["@team2"]) . "-" . @$top50["@static_id"],
                    "country" => @$top50["@category"],
                    "leagueId" => @$top50["@league_id"],
                    "league" => @$top50["@league"],
                    "staticId" => @$top50["@static_id"],
                    "date" => Carbon::parse(@$top50["@date"])->format("F j, Y"),
                    "homeTeam" => [
                        "id" => $top50["@id1"],
                        "name" => $top50["@team1"],
                        "score" => $top50["@team1_score"],
                    ],
                    "awayTeam" => [
                        "id" => @$top50["@id2"],
                        "name" => @$top50["@team2"],
                        "score" => @$top50["@team2_score"],
                    ],
                ];
            });
        }


        return $data;
    }

    private static function last5away($data, $key)
    {
        return  @$data->last5_away[$key]["match"];
    }

    private static function getGoals($data, $key)
    {
        return  @$data->goals[$key][$key];
    }

    private static function getBiggestDeafeat($data, $key) {
        return  @$data->biggest_defeat[$key]["match"];
    }

    private static function getBiggestVictory($data, $key) {
        return  @$data->biggest_victory[$key]["match"];
    }

    private static function getOverall($data, $parent, $key) {
        $data =  @$data->overall[$parent][$key];

        return $data;
    }

    private static function top50($data, $key) {
        return  @$data->top50["match"];
    }
}
