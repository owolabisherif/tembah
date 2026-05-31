<?php

namespace App\Transformers;

use App\Actions\StoreAndGetLeagueAction;
use App\Enums\MatchEvent;
use App\Jobs\StoreFixturesJob;
use App\Jobs\StoreLeagueFixturesJob;
use App\Jobs\StoreTeamImageJob;
use App\Jobs\StoreTeamJob;
use App\Models\Fixture;
use App\Models\League;
use App\Models\LeagueFixture;
use App\Models\Team;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use stdClass;


class GameTransformer
{
    private array $output  = [];
    private string $timezone;
    private array $matches = [];
    private array $fixturesToStore = [];
    private array $teams = [];
    private array $fixtureLeague = [];
   
    public function __construct(private array $games)
    {
        $this->timezone = @getUserLocation()?->time_zone?->name ?? 'Asia/Qatar';

        $this->sanitize();
    }

    public static function make(array $games): static {
        return new static($games);
    }

    private function sanitize() {
        

        $blackListed = blackListedLeagues();

        if(empty($blackListed)) {
            $this->flatten();
            return;
        };

        $this->games = array_filter($this->games, function ($value) use($blackListed) {
            return !in_array($value->{"@id"} ?? $value["@id"], $blackListed);
        });

        $this->flatten();
    }

    private function flatten() {
        $data = [];
        $badData = [];

        foreach ($this->games as $game) {
        
            $game = (object) $game;

            if($game->{'@id'} == ''){
                continue;
            }

            $g = $game->matches instanceof stdClass ? (array) $game->matches : $game->matches;

            if(!@$g["match"]) {
                continue;
            }

            $gameData = $g["match"] instanceof stdClass ? $this->parseArray($g["match"]) : $g["match"];
            
            $updatedMatch = $this->transform($game->{'@id'}, @$game->matches->{'@formatted_date'}, $game->{'@name'}, $game->{'@file_group'}, $gameData);

            if(empty($updatedMatch)) {
                $updatedMatch = $this->formatBadData($game->{'@id'}, @$game->matches->{'@formatted_date'}, $game->{'@name'}, $game->{'@file_group'},$gameData);
            }


            if(empty($updatedMatch)) {
                continue;
            }


            ['sort' => $sort, 'data' => $leagueData] = $this->getLeagueData($game->{'@id'}, $updatedMatch);

            $data = [...$data, [
                "id" => $game->{'@id'},
                "league" => $game->{'@name'},
                "leagueAr" => getArabic($game->{'@name'}),
                "leagueData" => $leagueData,
                "imageUrl" => null,
                "country" => $game->{'@file_group'},
                "sort" => $sort,
                "matches" => $updatedMatch,  //empty($updatedMatch) ? $this->getStoredMatch($game->{'@id'}, @$game->matches->{'@formatted_date'}, $game->{'@name'}, $game->{'@file_group'}) :  
            ]];
        }

        $data = collect($data)->sortBy("sort", SORT_NATURAL)->toArray();


        $this->output = (array) $data;
    }

    private function parseArray($match) {
        return [
            "@id" => @$match->{"@id"},
            "@status" => @$match->{"@status"},
            "@timer" => @$match->{"@timer"},
            "@inj_time" => @$match->{"@inj_time"},
            "@inj_minute" => @$match->{"@inj_minute"},
            "@date" => @$match->{"@date"},
            "@formatted_date" => @$match->{"@formatted_date"},
            "@time" => @$match->{"@time"},
            "@commentary_available" => @$match->{"@commentary_available"},
            "ht" => @$match->{"ht"},
            "events" => @$match->{"events"},
            "visitorteam" => @$match->{"visitorteam"},
            "localteam" => @$match->{"localteam"},
            "@fix_id" => @$match->{"@fix_id"},
            "@heatmap" => @$match->{"@heatmap"},
            "@static_id" => @$match->{"@static_id"},
            "@venue" => @$match->{"@venue"},
            "@coveredLive" => @$match->{"@coveredLive"},
            "@v" => @$match->{"@v"},
        ];
    }

    private function getLeagueData(int $leagueId, $updatedMatch): array {
        $league = League::with(["country"])->whereLeagueId($leagueId)->first();
        
        if(!$league) $league = StoreAndGetLeagueAction::handle($leagueId);

        if(!$league) return ["sort" => 900000, "data" => null];

        return [
            "sort" => $this->getLeagueSort($league, $updatedMatch),
            "data" => [
                "id" => $league->id,
                "leagueId" => $league->league_id,
                "slug" => $league->slug,
                "slugAr" => $league->slug_ar,
                "name" => $league->name,
                "nameAr" => $league->name_ar,
                "logo" => $league->logo,
                "country" => $league->country->name,
                "season" => $league->season,
            ]
        ];


    }

    private function getLeagueSort($league, $updatedMatch) {
        $autoSort = true;

        if(!$autoSort) return $league->sort;

        

        $userCountry = getUserLocation()?->location?->country_name ?? 'Qatar';

        $isUserCountryPlaying = collect($updatedMatch)->first(function ($match) use($userCountry) {
            return strtolower($match["homeTeam"]["name"]) == strtolower($userCountry) || strtolower($match["awayTeam"]["name"]) == strtolower($userCountry);
        });


        if(strtolower($league->country->name) == strtolower($userCountry) || $isUserCountryPlaying) {
            return 1;
        } else if ($league->is_top == 1) {
            return 2;
        } else if (in_array(strtolower($league->country->name), getCountriesInContinent())) {
            return 3;
        } else {
            return 4;
        }
    }

    /**
     * A Game transformer.
     *
     * @return array
     */
    private function transform($league, $date, $leagueName, $country, ?array $matchList): array
    {        
        if(!$matchList) return [];

        $date = Carbon::parse($date)->format("Y-m-d");

        $this->fixtureLeague = [...$this->fixtureLeague, [
            "league_id" => $league,
            "league" => $leagueName,
            "country" => $country,
            "date" => $date,
            "match" => json_encode($matchList)
        ]];

        return $this->format($matchList, $league, $date, $leagueName, $country);
    }


    private function format($matchList, $league, $date, $leagueName, $country): array {
        $fixtures = [];

        
       
        foreach ($matchList as $match) {
            $localHasLogo = Team::whereTeamId(@$match->localteam->{"@id"})->first(["image"]);
            $visitorHasLogo = Team::whereTeamId(@$match->visitorteam->{"@id"})->first(["image"]);
            
            // if($localHasLogo && @$match->localteam->{"@id"}) StoreTeamJob::dispatch(@$match->localteam->{"@id"});
            // if($visitorHasLogo && @$match->visitorteam->{"@id"}) StoreTeamJob::dispatch(@$match->visitorteam->{"@id"});

            $dateString = @$match->{"@formatted_date"} != '' ? explode(".", Carbon::parse(@$match->{"@formatted_date"})->format("Y.m.d")) : [now()->year, now()->month, now()->day];

            $next = Carbon::create($dateString[0], $dateString[1], $dateString[2], 0, 0, 0, $this->timezone);
            $now = Carbon::create(now()->year, now()->month, now()->day, 0, 0, 0, $this->timezone);

            // $sort = Carbon::parse(@$match->{'@formatted_date'} . " " . @$match->{"@time"})->setTimezone($this->timezone)->timestamp;

            $gameTime = Carbon::parse(@$match->{"@time"})->setTimezone($this->timezone);
            $gameDate = Carbon::parse(@$match->{"@formatted_date"})->setTimezone($this->timezone);
            $timeNow = Carbon::now()->setTimezone($this->timezone);

            if(gettype($match) === "string"); {
                $match = json_decode(json_encode($match));
            }

            $status = @$match->{"@status"};

            try {
                Carbon::parse($status)->setTimezone($this->timezone)->format("h:i A");
                $notStarted = true;
            } catch (\Exception $e) {
                $notStarted = false;
            }

            $status = $notStarted ? 'Not started' : $status;

            $gameState = ["Pen.", "FT", "AET","HT", "WO", "Postp.", "Aban.", "Cancl.", "Susp.", "Int.", "Delayed", "Awarded", "Not started"];

            $events = $this->transformEvents(@$match->events->event);

            $teamId = [
                @$match->localteam->{"@id"},
                @$match->visitorteam->{"@id"}
            ];

            if(!@$match->localteam->{"@id"} && !@$match->visitorteam->{"@id"}) {
                continue;
            }
            
            // Adjust if most teams have been stores or updated.
            foreach($teamId as $t) {
                if($t) $this->teams[] = $t;
            }
            
            $homeTeamSlug = Str::slug(@$match->localteam->{"@name"});
            $awayTeamSlug = Str::slug(@$match->visitorteam->{"@name"});

            $data = [
                "id" => @$match->{'@id'},
                'sort' => 0,
                'slug' => $homeTeamSlug."-vs-".$awayTeamSlug."-".@$match->{'@static_id'},
                "staticId" => @$match->{'@static_id'},
                "fixId" => @$match->{'@fix_id'},
                "status" => $status,
                "timer" => @$match->{'@timer'},
                "isLive" => $gameDate->isToday() && $timeNow->timestamp >= $gameTime->timestamp && !collect($gameState)->contains($status),
                "injuryTime" => @$match->{'@inj_time'},
                "injuryMinute" => @$match->{'@inj_minute'},
                "date" => $gameDate->format("M d, Y"),
                "time" => $gameTime->format("h:i A"),
                "commentaryId" => @$match->{"@commentary_available"},
                "venue" => @$match->{"@venue"},
                "venueAr" => getArabic(@$match->{"@venue"}),
                "venueCity" => @$match->{"@venue"},
                "venueCityAr" => getArabic(@$match->{"@venue"}),
                "venueId" => @$match->{"@v"},
                "isNext" => @$match->{"@formatted_date"} != "" ? $next->eq($now) : false,
                "homeTeam" => [
                    "slug" => $homeTeamSlug,
                    "slugAr" => makeArabicSlug(getArabic(@$match->localteam->{"@name"})),
                    "teamId" => @$match->localteam->{"@id"},
                    "logo" => @$localHasLogo->image ?: null,
                    "name" => @$match->localteam->{"@name"},
                    "nameAr" => getArabic(@$match->localteam->{"@name"}),
                    "ftScore" => (int) @$match->localteam->{"@goals"},
                    "hasRed" => $this->checkEventForTeam('localteam', $events, MatchEvent::RedCard),
                    "hasYellow" => $this->checkEventForTeam('localteam', $events, MatchEvent::YellowCard),
                    "hasYellowRed" => $this->checkEventForTeam('localteam', $events, MatchEvent::YellowRed),
                ],
                "awayTeam" => [
                    "slug" => $awayTeamSlug,
                    "slugAr" => makeArabicSlug(getArabic(@$match->visitorteam->{"@name"})),
                    "teamId" => @$match->visitorteam->{"@id"},
                    "logo" => @$visitorHasLogo->image ?: null,
                    "name" => @$match->visitorteam->{"@name"},
                    "nameAr" => getArabic(@$match->visitorteam->{"@name"}),
                    "ftScore" => (int) @$match->visitorteam->{"@goals"},
                    "hasRed" => $this->checkEventForTeam('visitorteam', $events, MatchEvent::RedCard),
                    "hasYellow" => $this->checkEventForTeam('visitorteam', $events, MatchEvent::YellowCard),
                    "hasYellowRed" => $this->checkEventForTeam('visitorteam', $events, MatchEvent::YellowRed),
                ],
                "halfTimeScore" => @$match->ht->{"@score"},
                "fullTimeScore" => @$match->ft->{"@score"},
                "events" => $events,
            ];

            $fixtures[] =  $data;

            $date = Carbon::parse($date)->format("Y-m-d");
            
            if($data["staticId"] != "") {
                $this->fixturesToStore = [...$this->fixturesToStore, [
                    "league_id" => $league,
                    "slug" => $homeTeamSlug."-vs-".$awayTeamSlug."-".$data["staticId"],
                    "home_team_id" => $data["homeTeam"]["teamId"],
                    "away_team_id" => $data["awayTeam"]["teamId"],
                    "fixture_id" => !empty(@$data["fixId"])  ? @$data["fixId"] : null,
                    "static_id" => $data["staticId"],
                    "league" => $leagueName,
                    "country" => $country,
                    "date" => $date,
                    "match" => json_encode($data)
                ]];
            }
        }

        return $fixtures;
    }


    private function formatBadData($league, $date, $leagueName, $country, $match) {
        $match = (object) $match;
        $homeTeamSlug = Str::slug(@$match->localteam->{"@name"});
        $awayTeamSlug = Str::slug(@$match->visitorteam->{"@name"});

        $status = @$match->{"@status"};

        try {
            Carbon::parse($status)->setTimezone($this->timezone)->format("h:i A");
            $notStarted = true;
        } catch (\Exception $e) {
            $notStarted = false;
        }

        $status = $notStarted ? 'Not started' : $status;

        $gameState = ["Pen.", "FT", "AET", "HT", "WO", "Postp.", "Aban.", "Cancl.", "Susp.", "Int.", "Delayed", "Awarded", "Not started"];

        $gameTime = Carbon::parse(@$match->{"@time"})->setTimezone($this->timezone);
        $gameDate = Carbon::parse(@$match->{"@formatted_date"})->setTimezone($this->timezone);
        $timeNow = Carbon::now()->setTimezone($this->timezone);

        $localHasLogo = Team::whereTeamId(@$match->localteam->{"@id"})->first(["image"]);
        $visitorHasLogo = Team::whereTeamId(@$match->visitorteam->{"@id"})->first(["image"]);

        $dateString = @$match->{"@formatted_date"} != '' ? explode(".", Carbon::parse(@$match->{"@formatted_date"})->format("Y.m.d")) : [now()->year, now()->month, now()->day];

        $next = Carbon::create($dateString[0], $dateString[1], $dateString[2], 0, 0, 0, $this->timezone);
        $now = Carbon::create(now()->year, now()->month, now()->day, 0, 0, 0, $this->timezone);

        $events = $this->transformEvents(@$match->events->event);

        $data = [
            "id" => @$match->{'@id'},
            'sort' => 0,
            'slug' => $homeTeamSlug . "-vs-" . $awayTeamSlug . "-" . @$match->{'@static_id'},
            "staticId" => @$match->{'@static_id'},
            "fixId" => @$match->{'@fix_id'},
            "status" => $status,
            "timer" => @$match->{'@timer'},
            "isLive" => $gameDate->isToday() && $timeNow->timestamp >= $gameTime->timestamp && !collect($gameState)->contains($status),
            "injuryTime" => @$match->{'@inj_time'},
            "injuryMinute" => @$match->{'@inj_minute'},
            "date" => $gameDate->format("M d, Y"),
            "time" => $gameTime->format("h:i A"),
            "commentaryId" => @$match->{"@commentary_available"},
            "venue" => @$match->{"@venue"},
            "venueCity" => @$match->{"@venue"},
            "venueId" => @$match->{"@v"},
            "isNext" => @$match->{"@formatted_date"} != "" ? $next->eq($now) : false,
            "homeTeam" => [
                "slug" => $homeTeamSlug,
                "slugAr" => makeArabicSlug(@$match->localteam->{"@name"}),
                "teamId" => @$match->localteam->{"@id"},
                "logo" => @$localHasLogo->image ?: null,
                "name" => @$match->localteam->{"@name"},
                "nameAr" => getArabic(@$match->localteam->{"@name"} ?? ""),
                "ftScore" => (int) @$match->localteam->{"@goals"},
                "hasRed" => $this->checkEventForTeam('localteam', $events, MatchEvent::RedCard),
                "hasYellow" => $this->checkEventForTeam('localteam', $events, MatchEvent::YellowCard),
                "hasYellowRed" => $this->checkEventForTeam('localteam', $events, MatchEvent::YellowRed),
            ],
            "awayTeam" => [
                "slug" => $awayTeamSlug,
                "slugAr" => makeArabicSlug(@$match->visitorteam->{"@name"}),
                "teamId" => @$match->visitorteam->{"@id"},
                "logo" => @$visitorHasLogo->image ?: null,
                "name" => @$match->visitorteam->{"@name"},
                "nameAr" => getArabic(@$match->visitorteam->{"@name"} ?? ""),
                "ftScore" => (int) @$match->visitorteam->{"@goals"},
                "hasRed" => $this->checkEventForTeam('visitorteam', $events, MatchEvent::RedCard),
                "hasYellow" => $this->checkEventForTeam('visitorteam', $events, MatchEvent::YellowCard),
                "hasYellowRed" => $this->checkEventForTeam('visitorteam', $events, MatchEvent::YellowRed),
            ],
            "halfTimeScore" => @$match->ht->{"@score"},
            "fullTimeScore" => @$match->ft->{"@score"},
            "events" => $events,
        ];

        $date = Carbon::parse($date)->format("Y-m-d");

        if ($data["staticId"] != "") {
            $this->fixturesToStore = [...$this->fixturesToStore, [
                "league_id" => $league,
                "slug" => $homeTeamSlug . "-vs-" . $awayTeamSlug . "-" . $data["staticId"],
                "fixture_id" => !empty(@$data["fixId"])  ? @$data["fixId"] : null,
                "static_id" => $data["staticId"],
                "home_team_id" => $data["homeTeam"]["teamId"],
                "away_team_id" => $data["awayTeam"]["teamId"],
                "league" => $leagueName,
                "country" => $country,
                "date" => $date,
                "match" => json_encode($data)
            ]];
        }

        return [$data];
    }

    private function storeTeamImage() {
        $now = now()->format("y-m-d");

        $ranToday = false;
        $ranTodayLeague = false;

        $hasTeam = Cache::get("{$now}-team-queue");
        $hasLeague = Cache::get("{$now}-league-fixture-today");

        if($hasTeam) {
            $previousTeam = json_decode($hasTeam);

            if(count($previousTeam) == $this->teams) $ranToday = true;
        }

        if($hasLeague) {
            $previousLeague = json_decode($hasLeague);

            if(count($previousLeague) == $this->fixtureLeague) $ranTodayLeague = true;
        }

        if (!$ranToday && !empty($this->teams)) {
            // Cache::put("{$now}-team-queue", json_encode($this->teams));
            // if (!empty($this->teams)) StoreTeamImageJob::dispatch($this->teams);
        }

        if (!$ranTodayLeague && !empty($this->fixtureLeague)) {
            Cache::put("{$now}-league-fixture-today", json_encode($this->fixtureLeague));
            StoreLeagueFixturesJob::dispatch($this->fixtureLeague);
        }
    }

    private function checkEventForTeam($team, $events, MatchEvent $type): mixed {
        if(empty($events)) return false;

        $checkType = match($type) {
            MatchEvent::RedCard => MatchEvent::RedCard,
            MatchEvent::YellowCard => MatchEvent::YellowCard,
            MatchEvent::Goal => MatchEvent::Goal,
            MatchEvent::YellowRed => MatchEvent::YellowRed,
            default => MatchEvent::Unknown
        };

        if($checkType == MatchEvent::Unknown) return false;

        $exists = collect($events)->first(function ($event, $key) use($checkType, $team) {
            return $event["type"] == $checkType->value && $event['team'] == $team;
        }, false);

        if(!$exists) return false;

        return true;
    }

    private function transformEvents($events): array {
        $eventsList = [];

        if(!$events) return [];

        if(($events instanceof stdClass) ) {
            $events = $this->parseEventArray($events);
        }

        foreach ($events as $event) {
            $eventsList[] = [
                "id" => @$event->{"@eventid"},
                "type" => @$event->{'@type'},
                "minute" => @$event->{'@minute'},
                "extraMinute" => @$event->{'@extra_min'},
                "team" => @$event->{'@team'},
                "player" => @$event->{"@player"},
                "result" => @$event->{"@result"},
                "playerId" => @$event->{"@playerId"},
                "assist" => @$event->{"@assist"},
                "assistId" => @$event->{"@assistid"},
            ];
        }

        return $eventsList;
    }

    private function parseEventArray($event) {
        $std = new stdClass();

        $std->{"@type"} = $event->{"@type"};
        $std->{"@minute"} = $event->{"@minute"};
        $std->{"@extra_min"} = $event->{"@extra_min"};
        $std->{"@team"} = $event->{"@team"};
        $std->{"@player"} = $event->{"@player"};
        $std->{"@result"} = $event->{"@result"};
        $std->{"@playerId"} = $event->{"@playerId"};
        $std->{"@assist"} = $event->{"@assist"};
        $std->{"@assistid"} = $event->{"@assistid"};
        $std->{"@eventid"} = $event->{"@eventid"};

        return [$std];
    }

    public function get(): array {
        $this->storeTeamImage();
        StoreFixturesJob::dispatch($this->fixturesToStore);
        
        $this->fixturesToStore = [];
        $this->fixtureLeague = [];

        return [...$this->output];
    }
}
