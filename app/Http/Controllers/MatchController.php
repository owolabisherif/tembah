<?php

namespace App\Http\Controllers;

use App\Models\Fixture;
use App\Models\League;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class MatchController extends Controller
{
    public function index($period = "today")
    {
        return Inertia::render("match", [
            "period" => $period,
        ]);
    }

    public function show($slug) {
        $data = [];
        $leagueData = [];
        $fixture = Fixture::with(["homeTeam", "awayTeam", "seo", "matchLeague"])->whereSlug($slug)->first();


        Log::info($fixture);

    
        if ($fixture) {
            // $league = League::whereLeagueId($fix->league_id)->first();

            // $leagueData = [
            //     "id" => @$league->id,
            //     "sort" => @$league->sort,
            //     "leagueId" => @$league->league_id,
            //     "slug" => @$league->slug,
            //     "slugAr" => @$league->slug_ar,
            //     "name" => @$league->name,
            //     "nameAr" => @$league->name_ar,
            //     "logo" => @$league->logo,
            //     "country" => @$league->country,
            //     "season" => "",
            // ];

            $data = [
                "id" => $fixture->id,
                "league" => $fixture->league,
                "leagueId" => $fixture->league,
                "leagueData" => $fixture->league ? [
                    "id" => @$fixture->matchLeague->id,
                    "sort" => @$fixture->matchLeague->sort,
                    "leagueId" => @$fixture->matchLeague->league_id,
                    "slug" => @$fixture->matchLeague->slug,
                    "slugAr" => @$fixture->matchLeague->slug_ar,
                    "name" => @$fixture->matchLeague->name,
                    "nameAr" => @$fixture->matchLeague->name_ar,
                    "logo" => @$fixture->matchLeague->logo,
                    "country" => @$fixture->matchLeague->country ?? "",
                    "season" => @$fixture->matchLeague->season ?? "",
                ] : [],
                "imageUrl" => null,
                "country" => $fixture->country,
                "homeTeam" => $fixture->homeTeam,
                "awayTeam" => $fixture->awayTeam,
                "sort" => $fixture->sort,
                "match" => $fixture->match,
            ];
        }

        return Inertia::render("show-match", [
            "slug" => $slug,
            "fixture" => Inertia::defer(fn() => $fixture ? $data : null),
            "seo" => $this->getTeamSEO($fixture),
        ]);
    }

    private function getTeamSEO(Fixture | null $fixture): array
    {
        if(!$fixture) return [];

        $matchData = json_decode(json_encode($fixture->match));

        $homeTeamAthletes = $fixture->homeTeam ? getTeamSquad(json_decode($fixture->homeTeam->squad)) : [];
        $homeTeamCoach = $fixture->homeTeam ? getTeamCoach(json_decode($fixture->homeTeam->coach)) : [];
        $awayTeamAthletes = $fixture->awayTeam ? getTeamSquad(json_decode($fixture->awayTeam->squad)) : [];
        $awayTeamCoach = $fixture->awayTeam ? getTeamCoach(json_decode($fixture->awayTeam->coach)) : [];

        $homeTeamleagueIds = $fixture->homeTeam ? json_decode($fixture->homeTeam->leagues) : [];
        $awayTeamleagueIds = $fixture->awayTeam ? json_decode($fixture->awayTeam->leagues) : [];

        $homeTeamMemberOf = $fixture->homeTeam && $homeTeamleagueIds ? Cache::rememberForever("{$fixture->homeTeam->name}-leagues-member-of", function () use ($homeTeamleagueIds) {
            return League::whereIn("league_id", $homeTeamleagueIds->league_id)->get();
        }) : [];

        $awayTeamMemberOf = $fixture->awayTeam && $awayTeamleagueIds ? Cache::rememberForever("{$fixture->awayTeam->name}-leagues-member-of", function () use ($awayTeamleagueIds) {
            return League::whereIn("league_id", $awayTeamleagueIds->league_id)->get();
        }) : [];


        if(!$fixture->seo) return [
            "name" => $fixture->matchLeague->season . " {$matchData->homeTeam->name} vs {$matchData->awayTeam->name} | Tembah",
            "name_ar" => "{$matchData->homeTeam->nameAr} vs {$matchData->awayTeam->nameAr} | Tembah",
            "meta_title" => "{$matchData->homeTeam->name} vs {$matchData->awayTeam->name} | Tembah",
            "meta_title_ar" => "{$matchData->homeTeam->nameAr} vs {$matchData->awayTeam->nameAr} | Tembah",
            "status" => $matchData->status,
            "image" => @$fixture->matchLeague->logo ?? "",
            "organizer" => [
                "@type" => "Organization",
                "name" => $fixture->league,
            ],
            "homeTeam" => [
                "@type" => "SportsTeam",
                "name" => $fixture->homeTeam ? $fixture->homeTeam->name : $matchData->homeTeam->name,
                "logo" => $fixture->homeTeam ? $fixture->homeTeam->image : $matchData->homeTeam->logo,
                "athlete" => !empty($homeTeamAthletes) ? collect($homeTeamAthletes)->map(function ($person) {
                    return [
                        "@type" => "Person",
                        "name" => $person['name'],
                    ];
                }) : [],
                "coach" => $homeTeamCoach ? [
                    "@type" => "Person",
                    "name" => $homeTeamCoach['name'],
                ] : [],
                "memberOf" => count($homeTeamMemberOf) ? $homeTeamMemberOf->map(function ($league) {
                    return [
                        "@type" => "SportsOrganization",
                        "name" => $league->name,
                        "sport" => "Football",
                    ];
                }) : [],
            ],
            "awayTeam" => [
                "@type" => "SportsTeam",
                "name" => $fixture->awayTeam ? $fixture->awayTeam->name : $matchData->awayTeam->name,
                "logo" => $fixture->awayTeam ? $fixture->awayTeam->image : $matchData->awayTeam->logo,
                "athlete" => !empty($awayTeamAthletes) ? collect($awayTeamAthletes)->map(function ($person) {
                    return [
                        "@type" => "Person",
                        "name" => $person['name'],
                    ];
                }) : [],
                "coach" => $awayTeamCoach ? [
                    "@type" => "Person",
                    "name" => $awayTeamCoach['name'],
                ] : [],
                "memberOf" =>  count($awayTeamMemberOf) ? $awayTeamMemberOf->map(function ($league) {
                    return [
                        "@type" => "SportsOrganization",
                        "name" => $league->name,
                        "sport" => "Football",
                    ];
                }) : [],
            ],
            "location" => $fixture->homeTeam ? $fixture->homeTeam->venue_name : $matchData->venue,
            "url" => route("soccer.team.matches", ["slug" => $fixture->slug]),
            "date" => $fixture ? $fixture->date : now(),
            "breadcrumb" => [
                [
                    "@type" => "ListItem",
                    "position" => 1,
                    "name" => "Welcome",
                    "item" => "https://tembah.net/"
                ],
                [
                    "@type" => "ListItem",
                    "position" => 2,
                    "name" => $fixture->league,
                    "item" => route('index.league', ["slug" => @$fixture->matchLeague->slug ?? $fixture->slug])
                ],
                [
                    "@type" => "ListItem",
                    "position" => 3,
                    "name" => $fixture->homeTeam && $fixture->awayTeam ? "{$fixture->homeTeam->name} vs {$fixture->awayTeam->name}" : "{$matchData->awayTeam->name} vs ",
                    "item" => route("soccer.team.matches", ["slug" => $fixture->slug]),
                ],
            ],
            "type" => 'sport-event'
        ]; 

        return [
            "name" => $fixture->matchLeague->season . " {$matchData->homeTeam->name} vs {$matchData->awayTeam->name} | Tembah",
            "name_ar" => "{$matchData->homeTeam->nameAr} vs {$matchData->awayTeam->nameAr} | Tembah",
            "meta_title" => $fixture->seo->meta_title,
            "meta_title_ar" => $fixture->seo->meta_title_ar,
            "meta_desc" => $fixture->seo->meta_desc,
            "meta_desc_ar" => $fixture->seo->meta_desc_ar,
            "keywords" => $fixture->seo->keywords,
            "keywords_ar" => $fixture->seo->keywords_ar,
            "status" => strtolower($matchData->status),
            "image" => @$fixture->matchLeague->logo ?? "",
            "organizer" => [
                "@type" => "Organization",
                "name" => $fixture->league
            ],
            "homeTeam" => [
                "@type" => "SportsTeam",
                "name" => $fixture->homeTeam ? $fixture->homeTeam->name : $matchData->homeTeam->name,
                "logo" => $fixture->homeTeam ? $fixture->homeTeam->image : $matchData->homeTeam->logo,
                "athlete" => !empty($homeTeamAthletes) ? collect($homeTeamAthletes)->map(function ($person) {
                    return [
                        "@type" => "Person",
                        "name" => $person['name'],
                    ];
                }) : [],
                "coach" => $homeTeamCoach ? [
                    "@type" => "Person",
                    "name" => $homeTeamCoach['name'],
                ] : [],
                "memberOf" => $homeTeamMemberOf->count() ? $homeTeamMemberOf->map(function ($league) {
                    return [
                        "@type" => "SportsOrganization",
                        "name" => $league->name,
                        "sport" => "Football",
                    ];
                }) : [],
            ],
            "awayTeam" => [
                "@type" => "SportsTeam",
                "name" => $fixture->awayTeam ? $fixture->awayTeam->name : $matchData->awayTeam->name,
                "logo" => $fixture->awayTeam ? $fixture->awayTeam->image : $matchData->awayTeam->logo,
                "athlete" => !empty($awayTeamAthletes) ? collect($awayTeamAthletes)->map(function ($person) {
                    return [
                        "@type" => "Person",
                        "name" => $person['name'],
                    ];
                }) : [],
                "coach" => $awayTeamCoach ? [
                    "@type" => "Person",
                    "name" => $awayTeamCoach['name'],
                ] : [],
                "memberOf" => $awayTeamMemberOf->count() ? $awayTeamMemberOf->map(function ($league) {
                    return [
                        "@type" => "SportsOrganization",
                        "name" => $league->name,
                        "sport" => "Football",
                    ];
                }) : [],
            ],
            "location" => $fixture->homeTeam ? $fixture->homeTeam->venue_name : $matchData->venue,
            "url" => route("soccer.team.matches", ["slug" => $fixture->slug]),
            "date" => $fixture ? $fixture->date : now(),
            "breadcrumb" => [
                [
                    "@type" => "ListItem",
                    "position" => 1,
                    "name" => "Welcome",
                    "item" => "https://tembah.net/"
                ],
                [
                    "@type" => "ListItem",
                    "position" => 2,
                    "name" => $fixture->league,
                    "item" => route('index.league', ["slug" => @$fixture->matchLeague->slug ?? $fixture->slug])
                ],
                [
                    "@type" => "ListItem",
                    "position" => 3,
                    "name" => $fixture->homeTeam && $fixture->awayTeam ? "{$fixture->homeTeam->name} vs {$fixture->awayTeam->name}" : "{$matchData->awayTeam->name} vs ",
                    "item" => route("soccer.team.matches", ["slug" => $fixture->slug]),
                ],
            ],
            "type" => 'sport-event'
        ];
    }
}
