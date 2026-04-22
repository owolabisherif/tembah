<?php

namespace App\Transformers;

use App\Enums\MatchEvent;
use App\Models\Fixture;
use App\Models\Team;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use stdClass;

class StoredGameTransformer
{
    private array $output  = [];
    private string $timezone;
    private array $matches = [];
    private array $fixturesToStore = [];

   
    public function __construct(private array $games)
    {
        $this->timezone = @getUserLocation()?->time_zone?->name ?? 'Asia/Qatar';

        $this->flatten();
    }

    public static function make(array $games): static {
        return new static($games);
    }


    private function generateSort($league): int {
        return 0;
    }

    private function flatten()
    {
        $data = [];

        foreach ($this->games as $game) {
            $game = (object) $game;

            $matchList = @$game->match;

            $updatedMatch = $this->format($matchList);

            $data = [...$data, [
                "id" => $game->league_id,
                "league" => $game->league,
                "imageUrl" => null,
                "country" => $game->country,
                "date" => $game->date,
                "sort" => $this->generateSort($game->league_id),
                "matches" =>  $updatedMatch,
            ]];
        }

        $this->output = $data;
    }

    private function format($matchList): array
    {
        $fixtures = [];


        foreach ($matchList as $match) {
            $localHasLogo = Team::whereTeamId(@$match->localteam->{"@id"})->first(["image"]);
            $visitorHasLogo = Team::whereTeamId(@$match->visitorteam->{"@id"})->first(["image"]);

            $gameTime = Carbon::parse(@$match->{"@time"})->setTimezone($this->timezone);
            $gameDate = Carbon::parse(@$match->{"@formatted_date"})->setTimezone($this->timezone);
            $timeNow = Carbon::now()->setTimezone($this->timezone);

            if (gettype($match) === "string"); {
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

            $gameState = ["Pen.", "FT", "AET", "HT", "WO", "Postp.", "Aban.", "Cancl.", "Susp.", "Int.", "Delayed", "Awarded", "Not started"];

            $events = $this->transformEvents(@$match->events->event);


            $fixtures[] = [
                "id" => @$match->{'@id'},
                'sort' => 0,
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
                "isNext" => false,
                "homeTeam" => [
                    "slug" => Str::slug(@$match->localteam->{"@name"}),
                    "teamId" => @$match->localteam->{"@id"},
                    "logo" => @$localHasLogo->image ?: null,
                    "name" => @$match->localteam->{"@name"},
                    "ftScore" => (int) @$match->localteam->{"@goals"},
                    "hasRed" => $this->checkEventForTeam('localteam', $events, MatchEvent::RedCard),
                    "hasYellow" => $this->checkEventForTeam('localteam', $events, MatchEvent::YellowCard),
                    "hasYellowRed" => $this->checkEventForTeam('localteam', $events, MatchEvent::YellowRed),
                ],
                "awayTeam" => [
                    "slug" => Str::slug(@$match->visitorteam->{"@name"}),
                    "teamId" => @$match->visitorteam->{"@id"},
                    "logo" => @$visitorHasLogo->image ?: null,
                    "name" => @$match->visitorteam->{"@name"},
                    "ftScore" => (int) @$match->visitorteam->{"@goals"},
                    "hasRed" => $this->checkEventForTeam('visitorteam', $events, MatchEvent::RedCard),
                    "hasYellow" => $this->checkEventForTeam('visitorteam', $events, MatchEvent::YellowCard),
                    "hasYellowRed" => $this->checkEventForTeam('visitorteam', $events, MatchEvent::YellowRed),
                ],
                "halfTimeScore" => @$match->ht->{"@score"},
                "fullTimeScore" => @$match->ft->{"@score"},
                "events" => $events,
            ];
        }

        return $fixtures;
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

        return $this->output;
    }
}
