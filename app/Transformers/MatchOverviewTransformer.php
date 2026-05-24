<?php

namespace App\Transformers;

use App\Models\Player;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class MatchOverviewTransformer
{
    private array $output;
    private object $stats;
    private object $prediction;
    private string $timezone;
    private array $homePlayerStat;
    private array $awayPlayerStat;
    

    public function __construct(private array $data)
    {
        $this->timezone = @getUserLocation()?->time_zone?->name ?? 'Asia/Qatar';
        $this->initialize();
    }

    public static function make(array $data): static {
        return new static($data);
    }

    private function initialize()
    {
        $this->stats = (object) $this->data["stats"];
        $this->prediction = (object) $this->data["prediction"];


        $this->transform();
    }

    private function transform() {
        
        $gameTime = Carbon::parse(@$this->stats->{"@time"})->setTimezone($this->timezone);
        $gameDate = Carbon::parse(@$this->stats->{"@date"})->setTimezone($this->timezone);
        $fGameDate = Carbon::parse(@$this->stats->{"@formatted_date"})->setTimezone($this->timezone);

        $homeStats = @$this->stats->stats["localteam"];
        $awayStats = @$this->stats->stats["visitorteam"];
        
        $homeTeam = @$this->stats->teams["localteam"];
        $awayTeam  = @$this->stats->teams["visitorteam"];

        $homeSub = @$this->stats->substitutes["localteam"];
        $awaySub  = @$this->stats->substitutes["visitorteam"];
        
        $homeSubt = @$this->stats->substitutions["localteam"];
        $awaySubt  = @$this->stats->substitutions["visitorteam"];

        $homePlayerStats = @$this->stats->player_stats["localteam"];
        $awayPlayerStats  = @$this->stats->player_stats["visitorteam"];

        $homeColors = @$this->stats->team_colors["localteam"];
        $awayColors  = @$this->stats->team_colors["visitorteam"];

        $homePlayers = $this->getPlayers(@$homeTeam["player"]);
        $awayPlayers = $this->getPlayers(@$awayTeam["player"]);

        $this->homePlayerStat = $this->getPlayers(@$homePlayerStats["player"], "stats");
        $this->awayPlayerStat = $this->getPlayers(@$awayPlayerStats["player"], "stats");
        
        $this->output = [
            "id" => @$this->stats->{"@id"},
            "staticId" => @$this->stats->{"@static_id"},
            "status" => @$this->stats->{"@status"},
            "timer" => @$this->stats->{"@timer"},
            "date" => $gameDate,
            "formattedDate" => $fGameDate,
            "time" => $gameTime,
            "hasFormation" => @$homeTeam["@formation"] != null && @$awayTeam["@formation"] != null,
            "homeTeam" => [
                "id" => (int) @$this->stats->localteam["@id"],
                "name" => @$this->stats->localteam["@name"],
                "goals" => @$this->stats->localteam["@goals"],
                "htScore" => @$this->stats->localteam["@ht_score"],
                "ftScore" => @$this->stats->localteam["@ft_score"],
                "etScore" => @$this->stats->localteam["@et_score"],
                "penScore" => @$this->stats->localteam["@pen_score"],
                "summary" => [
                    "scorers" => $this->getScorers(@$this->stats->summary["localteam"]["goals"]["player"]),
                    "yellowCards" => $this->getOffenders(@$this->stats->summary["localteam"]["yellowcards"]["player"]),
                    "redCards" => $this->getOffenders(@$this->stats->summary["localteam"]["redcards"]["player"]),
                ],
                "lineup" => [
                    "formation" => @$homeTeam["@formation"],
                    "positions" => $this->generateFormation(@$homeTeam["@formation"], $homePlayers),
                    "players" => $this->getPlayers(@$homeTeam["player"]),
                ],
                "substitutes" => $this->getPlayers(@$homeSub["player"], "sub"),
                "substitution" => $this->getPlayers(@$homeSubt["substitution"], "subt"),
                "coach" => [
                    "id" => "",
                    "name" => ""
                ],
                "playerStats" => $this->getPlayers(@$homePlayerStats["player"], "stats"),
                "colors" => [
                    "player" => [
                        "primary" => @$homeColors["player"]["primary"]["@color"],
                        "number" => @$homeColors["player"]["number"]["@color"],
                        "border" => @$homeColors["player"]["border"]["@color"],
                    ],
                    "goalKeeper" => [
                        "primary" => @$homeColors["goalkeeper"]["primary"]["@color"],
                        "number" => @$homeColors["goalkeeper"]["number"]["@color"],
                        "border" => @$homeColors["goalkeeper"]["border"]["@color"],
                    ],
                ],
                "stats" => [
                    "shots" => [
                        "totalGoals" => @$homeStats["shots"]["@total"],
                        "onTarget" => @$homeStats["shots"]["@ongoal"],
                        "offTarget" => @$homeStats["shots"]["@offgoal"],
                        "blocked" => @$homeStats["shots"]["@blocked"],
                        "insideBox" => @$homeStats["shots"]["@insidebox"],
                        "outsideBox" => @$homeStats["shots"]["@outsidebox"],
                        "firstHalf" => [
                            "goals" => @$homeStats["shots"]["@total_h1"],
                            "onTarget" => @$homeStats["shots"]["@ongoal_h1"],
                            "offTarget" => @$homeStats["shots"]["@offgoal_h1"],
                            "blocked" => @$homeStats["shots"]["@blocked_h1"],
                            "insideBox" => @$homeStats["shots"]["@insidebox_h1"],
                            "outsideBox" => @$homeStats["shots"]["@outsidebox_h1"],
                        ],
                        "secondHalf" => [
                            "goals" => @$homeStats["shots"]["@total_h2"],
                            "onTarget" => @$homeStats["shots"]["@ongoal_h2"],
                            "offTarget" => @$homeStats["shots"]["@offgoal_h2"],
                            "blocked" => @$homeStats["shots"]["@blocked_h2"],
                            "insideBox" => @$homeStats["shots"]["@insidebox_h2"],
                            "outsideBox" => @$homeStats["shots"]["@outsidebox_h2"],
                        ],
                    ],
                    "fouls" => (int) @$homeStats["fouls"]["@total"],
                    "corners" => [
                        "total" => (int) @$homeStats["corners"]["@total"],
                        "firstHalf" => (int) @$homeStats["corners"]["@total_h1"],
                        "secondHalf" => (int) @$homeStats["corners"]["@total_h2"],
                    ],
                    "offsides" => [
                        "total" => (int) @$homeStats["offsides"]["@total"],
                        "firstHalf" => (int) @$homeStats["offsides"]["@total_h1"],
                        "secondHalf" => (int) @$homeStats["offsides"]["@total_h2"],
                    ],
                    "possession" => [
                        "total" => @$homeStats["possestiontime"]["@total"],
                        "firstHalf" => @$homeStats["possestiontime"]["@total_h1"],
                        "secondHalf" => @$homeStats["possestiontime"]["@total_h2"],
                    ],
                    "yellowCards" => [
                        "total" => @$homeStats["yellowcards"]["@total"],
                        "firstHalf" => @$homeStats["yellowcards"]["@total_h1"],
                        "secondHalf" => @$homeStats["yellowcards"]["@total_h2"],
                    ],
                    "redCards" => [
                        "total" => @$homeStats["redcards"]["@total"],
                        "firstHalf" => @$homeStats["redcards"]["@total_h1"],
                        "secondHalf" => @$homeStats["redcards"]["@total_h2"],
                    ],
                    "saves" => [
                        "total" => @$homeStats["saves"]["@total"],
                        "firstHalf" => @$homeStats["saves"]["@total_h1"],
                        "secondHalf" => @$homeStats["saves"]["@total_h2"],
                    ],
                    "passes" => [
                        "total" => @$homeStats["passes"]["@total"],
                        "accurate" => @$homeStats["passes"]["@accurate"],
                        "firstHalf" => [
                            "total" => @$homeStats["passes"]["@total_h1"],
                            "accurate" => @$homeStats["passes"]["@accurate_h1"],
                        ],
                        "secondHalf" => [
                            "total" => @$homeStats["passes"]["@total_h2"],
                            "accurate" => @$homeStats["passes"]["@accurate_h2"],
                        ],
                    ],
                    "xGoals" => [
                        "total" => @$homeStats["expected_goals"]["@total"],
                        "firstHalf" => @$homeStats["expected_goals"]["@total_h1"],
                        "secondHalf" => @$homeStats["expected_goals"]["@total_h2"],
                    ],
                    "goalPrevented" => [
                        "total" => @$homeStats["goals_prevented"]["@total"],
                        "firstHalf" => @$homeStats["goals_prevented"]["@total_h1"],
                        "secondHalf" => @$homeStats["goals_prevented"]["@total_h2"],
                    ],
                ],
            ],
            "awayTeam" => [
                "id" => (int) @$this->stats->visitorteam["@id"],
                "name" => @$this->stats->visitorteam["@name"],
                "goals" => @$this->stats->visitorteam["@goals"],
                "htScore" => @$this->stats->visitorteam["@ht_score"],
                "ftScore" => @$this->stats->visitorteam["@ft_score"],
                "etScore" => @$this->stats->visitorteam["@et_score"],
                "penScore" => @$this->stats->visitorteam["@pen_score"],
                "summary" => [
                    "scorers" => $this->getScorers(@$this->stats->summary["visitorteam"]["goals"]["player"]),
                    "yellowCards" => $this->getOffenders(@$this->stats->summary["visitorteam"]["yellowcards"]["player"]),
                    "redCards" => $this->getOffenders(@$this->stats->summary["visitorteam"]["redcards"]["player"]),
                ],
                "lineup" => [
                    "formation" => @$awayTeam["@formation"],
                    "positions" => $this->generateFormation(@$awayTeam["@formation"], $awayPlayers, true),
                    "players" => $this->getPlayers(@$awayTeam["player"]),
                ],
                "substitutes" => $this->getPlayers(@$awaySub["player"], "sub"),
                "substitution" => $this->getPlayers(@$awaySubt["substitution"], "subt"),
                "coach" => [
                    "id" => "",
                    "name" => ""
                ],
                "playerStats" => $this->getPlayers(@$awayPlayerStats["player"], "stats"),
                "colors" => [
                    "player" => [
                        "primary" => @$awayColors["player"]["primary"]["@color"],
                        "number" => @$awayColors["player"]["number"]["@color"],
                        "border" => @$awayColors["player"]["border"]["@color"],
                    ],
                    "goalKeeper" => [
                        "primary" => @$awayColors["goalkeeper"]["primary"]["@color"],
                        "number" => @$awayColors["goalkeeper"]["number"]["@color"],
                        "border" => @$awayColors["goalkeeper"]["border"]["@color"],
                    ],
                ],
                "stats" => [
                    "shots" => [
                        "totalGoals" => @$awayStats["shots"]["@total"],
                        "onTarget" => @$awayStats["shots"]["@ongoal"],
                        "offTarget" => @$awayStats["shots"]["@offgoal"],
                        "blocked" => @$awayStats["shots"]["@blocked"],
                        "insideBox" => @$awayStats["shots"]["@insidebox"],
                        "outsideBox" => @$awayStats["shots"]["@outsidebox"],
                        "firstHalf" => [
                            "goals" => @$awayStats["shots"]["@total_h1"],
                            "onTarget" => @$awayStats["shots"]["@ongoal_h1"],
                            "offTarget" => @$awayStats["shots"]["@offgoal_h1"],
                            "blocked" => @$awayStats["shots"]["@blocked_h1"],
                            "insideBox" => @$awayStats["shots"]["@insidebox_h1"],
                            "outsideBox" => @$awayStats["shots"]["@outsidebox_h1"],
                        ],
                        "secondHalf" => [
                            "goals" => @$awayStats["shots"]["@total_h2"],
                            "onTarget" => @$awayStats["shots"]["@ongoal_h2"],
                            "offTarget" => @$awayStats["shots"]["@offgoal_h2"],
                            "blocked" => @$awayStats["shots"]["@blocked_h2"],
                            "insideBox" => @$awayStats["shots"]["@insidebox_h2"],
                            "outsideBox" => @$awayStats["shots"]["@outsidebox_h2"],
                        ],
                    ],
                    "fouls" => (int) @$awayStats["fouls"]["@total"],
                    "corners" => [
                        "total" => (int) @$awayStats["corners"]["@total"],
                        "firstHalf" => (int) @$awayStats["corners"]["@total_h1"],
                        "secondHalf" => (int) @$awayStats["corners"]["@total_h2"],
                    ],
                    "offsides" => [
                        "total" => (int) @$awayStats["offsides"]["@total"],
                        "firstHalf" => (int) @$awayStats["offsides"]["@total_h1"],
                        "secondHalf" => (int) @$awayStats["offsides"]["@total_h2"],
                    ],
                    "possession" => [
                        "total" => @$awayStats["possestiontime"]["@total"],
                        "firstHalf" => @$awayStats["possestiontime"]["@total_h1"],
                        "secondHalf" => @$awayStats["possestiontime"]["@total_h2"],
                    ],
                    "yellowCards" => [
                        "total" => @$awayStats["yellowcards"]["@total"],
                        "firstHalf" => @$awayStats["yellowcards"]["@total_h1"],
                        "secondHalf" => @$awayStats["yellowcards"]["@total_h2"],
                    ],
                    "redCards" => [
                        "total" => @$awayStats["redcards"]["@total"],
                        "firstHalf" => @$awayStats["redcards"]["@total_h1"],
                        "secondHalf" => @$awayStats["redcards"]["@total_h2"],
                    ],
                    "saves" => [
                        "total" => @$awayStats["saves"]["@total"],
                        "firstHalf" => @$awayStats["saves"]["@total_h1"],
                        "secondHalf" => @$awayStats["saves"]["@total_h2"],
                    ],
                    "passes" => [
                        "total" => @$awayStats["passes"]["@total"],
                        "accurate" => @$awayStats["passes"]["@accurate"],
                        "firstHalf" => [
                            "total" => @$awayStats["passes"]["@total_h1"],
                            "accurate" => @$awayStats["passes"]["@accurate_h1"],
                        ],
                        "secondHalf" => [
                            "total" => @$awayStats["passes"]["@total_h2"],
                            "accurate" => @$awayStats["passes"]["@accurate_h2"],
                        ],
                    ],
                    "xGoals" => [
                        "total" => @$awayStats["expected_goals"]["@total"],
                        "firstHalf" => @$awayStats["expected_goals"]["@total_h1"],
                        "secondHalf" => @$awayStats["expected_goals"]["@total_h2"],
                    ],
                    "goalPrevented" => [
                        "total" => @$awayStats["goals_prevented"]["@total"],
                        "firstHalf" => @$awayStats["goals_prevented"]["@total_h1"],
                        "secondHalf" => @$awayStats["goals_prevented"]["@total_h2"],
                    ],
                ],
                
            ],
            "commentaries" => [],
            "matchInfo" => [
                "stadium" => @$this->stats->matchinfo["stadium"]["@name"],
                "attendance" => (int) @$this->stats->matchinfo['attendance']["@name"] ?? 0,
                "addedTimeFirst" => @$this->stats->matchinfo["time"]["@addedTime_period1"],
                "addedTimeSecond" => @$this->stats->matchinfo["time"]["@addedTime_period2"],
                "ref" => @$this->stats->matchinfo["referee"]["@name"],
            ],
            "predictions" => $this->prediction ? $this->handlePrediction() :  null,
        ];
    }

    private function handlePrediction() {
        $homeTeam = @$this->prediction->teams["localteam"];
        $awayTeam  = @$this->prediction->teams["visitorteam"];

        $homeColors = @$this->prediction->team_colors["localteam"];
        $awayColors  = @$this->prediction->team_colors["visitorteam"];

        $homePlayers = $this->getPlayers(@$homeTeam["player"]);
        $awayPlayers = $this->getPlayers(@$awayTeam["player"]);

        return [
            "hasPrediction" => @$homeTeam["@formation"] && @$awayTeam["@formation"],
            "homeTeam" => [
                "lineup" => [
                    "formation" => @$homeTeam["@formation"],
                    "positions" => $this->generateFormation(@$homeTeam["@formation"], $homePlayers),
                    "players" => $homePlayers,
                ],
                "colors" => [
                    "player" => [
                        "primary" => @$homeColors["player"]["primary"]["@color"],
                        "number" => @$homeColors["player"]["number"]["@color"],
                        "border" => @$homeColors["player"]["border"]["@color"],
                    ],
                    "goalKeeper" => [
                        "primary" => @$homeColors["goalkeeper"]["primary"]["@color"],
                        "number" => @$homeColors["goalkeeper"]["number"]["@color"],
                        "border" => @$homeColors["goalkeeper"]["border"]["@color"],
                    ],
                ],
            ],
            "awayTeam" => [
                "lineup" => [
                    "formation" => @$awayTeam["@formation"],
                    "positions" => $this->generateFormation(@$awayTeam["@formation"], $awayPlayers, true),
                    "players" => $awayPlayers,
                ],
                "colors" => [
                    "player" => [
                        "primary" => @$awayColors["player"]["primary"]["@color"],
                        "number" => @$awayColors["player"]["number"]["@color"],
                        "border" => @$awayColors["player"]["border"]["@color"],
                    ],
                    "goalKeeper" => [
                        "primary" => @$awayColors["goalkeeper"]["primary"]["@color"],
                        "number" => @$awayColors["goalkeeper"]["number"]["@color"],
                        "border" => @$awayColors["goalkeeper"]["border"]["@color"],
                    ],
                ],
            ],
        ];
    }

    private function generateFormation($formation, $players, bool $mirror = false): array  {

        if(!$formation) return [];

        $rows = array_map('intval', [1, ...explode("-", $formation)]);
        $pitchHeight = 50;
        $colSpacing = $pitchHeight / (count($rows) + 1);
        $id = 1;
        $teams =  [];

        foreach ($rows as $key => $count) {
            $x = ($key + 1) * $colSpacing;
            $spacing = 100 / ($count + 1);

            if ($mirror) {
                $x = 100 - $x;
            }

            for ($i=1; $i <=$count ; $i++) {
                $player = collect($players)->first(fn($value, $key) => $value["formationPos"] == $id);

                if(!$player) {
                    continue;
                }

                $data = $mirror ? $this->awayPlayerStat : $this->homePlayerStat;

                $isCaptain = collect($data)->first(fn($value, $key) => $value["id"] == $player["id"]);
                
                $isCaptain = $isCaptain ? $isCaptain["isCaptain"] : false;

                $y = $i * $spacing;

                 $teams[] = [
                    "id" => $mirror ? "away-$i-$count-$id" : "home-$i-$count-$id",
                    "pos" => $id,
                    "x" => $x,
                    "y" => $y,
                    "player" => $player,
                    "team" => $mirror ? 'away' : 'home',
                    "isGoalKeeper" => $id == 1 ? true : false,
                    "isCaptain" => $isCaptain,
                ];

                $id++;
            }
        }


        return $teams;
    }

    private function getPlayers($players, $type = "team"): array {
        if (!$players) return [];

        $teams = [];

        foreach ($players as $player) {
            $player = (object) $player;

            $data = match($type) {
                "sub" => [
                    "id" => $player->{"@id"},
                    "name" => $player->{"@name"},
                    "number" => $player->{"@number"},
                    "position" => $player->{"@pos"},
                ],
                "subt" => [
                    "off" => $player->{"@off"},
                    "offId" => (int) $player->{"@off_id"},
                    "on" => $player->{"@on"},
                    "onId" => (int) $player->{"@on_id"},
                    "minute" => $player->{"@minute"},
                    "injury" => $player->{"@injury"} == "" | $player->{"@injury"} == "False" ? false :true,
                ],
                "stats" => [
                    "id" => (int) $player->{"@id"},
                    "number" => $player->{"@num"},
                    "name" => $player->{"@name"},
                    "nameAr" => getArabic($player->{"@name"}),
                    "position" => $player->{"@pos"},
                    "isCaptain" => $player->{"@isCaptain"} == "" || $player->{"@isCaptain"} == "False" ? false : true,
                    "isSubst" => $player->{"@isSubst"} == "" || $player->{"@isSubst"} == "False" ? false : true,
                    "totalShots" => $player->{"@shots_total"},
                    "shotsOnGoal" => $player->{"@shots_on_goal"},
                    "goals" => $player->{"@goals"},
                    "goalsConceded" => $player->{"@goals_conceded"},
                    "minusGoals" => $player->{"@minus_goals"},
                    "assists" => $player->{"@assists"},
                    "offsides" => $player->{"@offsides"},
                    "foulsDrawn" => $player->{"@fouls_drawn"},
                    "foulsCommitted" => $player->{"@fouls_commited"},
                    "tackles" => $player->{"@tackles"},
                    "blocks" => $player->{"@blocks"},
                    "totalCrosses" => $player->{"@total_crosses"},
                    "accCrosses" => $player->{"@acc_crosses"},
                    "interceptions" => $player->{"@interceptions"},
                    "clearances" => $player->{"@clearances"},
                    "dispossesed" => $player->{"@dispossesed"},
                    "saves" => $player->{"@saves"},
                    "punches" => $player->{"@punches"},
                    "savesInsideBox" => $player->{"@savesInsideBox"},
                    "duelsTotal" => $player->{"@duelsTotal"},
                    "duelsWon" => $player->{"@duelsWon"},
                    "aerialsWon" => $player->{"@aerials_won"},
                    "dribbleAttempts" => $player->{"@dribbleAttempts"},
                    "dribbleSucc" => $player->{"@dribbleSucc"},
                    "dribbledPast" => $player->{"@dribbledPast"},
                    "yellowCards" => $player->{"@yellowcards"},
                    "bigChanceCreated" => $player->{"@big_chance_created"},
                    "bigChanceMissed" => $player->{"@big_chance_missed"},
                    "goodHighClaim" => $player->{"@good_high_claim"},
                    "clearanceOffine" => $player->{"@clearance_offine"},
                    "errorLeadToGoal" => $player->{"@error_lead_to_goal"},
                    "lastmanTackle" => $player->{"@lastman_tackle"},
                    "redCards" => $player->{"@redcards"},
                    "penScore" => $player->{"@pen_score"},
                    "penMiss" => $player->{"@pen_miss"},
                    "penSave" => $player->{"@pen_save"},
                    "penCommitted" => $player->{"@pen_committed"},
                    "penWon" => $player->{"@pen_won"},
                    "hitWoodwork" => $player->{"@hit_woodwork"},
                    "passes" => $player->{"@passes"},
                    "accuratePasses" => $player->{"@passes_acc"},
                    "keyPasses" => $player->{"@keyPasses"},
                    "minutesPlayed" => $player->{"@minutes_played"},
                    "rating" => $player->{"@rating"},
                ],
                default => [
                    "id" => $player->{"@id"},
                    "slug" => Str::slug($player->{"@name"}),
                    "image" => Player::wherePlayerId($player->{"@id"})->first(["image"])?->image,
                    "name" => $player->{"@name"},
                    "nameAr" => getArabic($player->{"@name"}),
                    "number" => $player->{"@number"},
                    "position" => $player->{"@pos"},
                    "formationPos" => $player->{"@formation_pos"},
                ]
            };

            $teams[] = $data;
        }

        return $teams;
    }

    private function getScorers($players): array {
        if(!$players) return [];

        $scorers = [];

        foreach ($players as $player) {
            $player = (object) $player;

            $scorers[] = [
                "id" => @$player->{"@id"},
                "name" => @$player->{"@name"},
                "assistId" => @$player->{"@assist_id"},
                "assistName" => @$player->{"@assist_name"},
                "extraMin" => @$player->{"@extra_min"},
                "ownGoal" => @$player->{"@owngoal"} == "False" ? false : true,
                "penalty" => str_contains(@$player->{"@minute"}, "pen") ? true : (@$player->{"@penalty"} == "False" ? false : true),
                "penaltyMissed" => @$player->{"@penalty_missed"} == "False" ? false : true,
                "varCancelled" => @$player->{"@var_cancelled"} == "False" ? false : true,
                "minute" => str_contains(@$player->{"@minute"}, "pen") ? explode(" ",@$player->{"@minute"})[2] : @$player->{"@minute"},
            ];
        }

        return $scorers;
    }

    private function getOffenders($players): array {
        if (!$players) return [];

        $scorers = [];

        foreach ($players as $player) {
            $player = (object) $player;
            $scorers[] = [
                "id" => @$player->{"@id"},
                "name" => @$player->{"@name"},
                "minute" => @$player->{"@minute"},
                "extraMinute" => @$player->{"@extra_min"},
                "comment" => @$player->{"@comment"},
            ];
        }

        return $scorers;
    }


    public function toArray(): array {
        return $this->output;
    }
}
