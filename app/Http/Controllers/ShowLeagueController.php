<?php

namespace App\Http\Controllers;

use App\Actions\StoreAndGetCurrentStandingAction;
use App\Models\League;
use App\Models\Team;
use App\Transformers\LeaguesTranformer;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ShowLeagueController extends Controller
{
    public function __invoke(string $slug)
    {

        $model = isArabic($slug) ? League::with(["country", "seo"])->whereSlugAr($slug) : League::with(["country", "seo"])->whereSlug($slug);

        $league = fractal($model->first(), new LeaguesTranformer)->toArray()["data"];

        return Inertia::render("show-league", [
            "league" => Inertia::defer(fn() => $league),
            "seo" => $this->getLeagueSEO($model->first()),
        ]);
    }

    private function getLeagueSEO(League $league): array {

        $teams = StoreAndGetCurrentStandingAction::handle($league);

        if(!$league->seo) return [
            "name" => "{$league->name} {$league->season}",
            "name_ar" => "{$league->name_ar} {$league->season}",
            "meta_title" => "{$league->name} {$league->season}",
            "meta_title_ar" => "{$league->name_ar} {$league->season}",
            "image" => $league->logo,
            "country" => @$league->country->name ?? "",
            "url" => route('index.league', ["slug" => $league->slug]),
            "published" => Carbon::parse($league->getRawOriginal('created_at'))->format("Y-m-d H:m:s"),
            "modified" => Carbon::parse($league->getRawOriginal('updated_at'))->format("Y-m-d H:m:s"),
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
                    "name" => $league->name,
                    "item" => route('index.league', ["slug" => $league->slug])
                ],
            ],
            "members" => !empty($teams) ? collect($teams)->map(function($team) {
                return [
                    "@type" => "SportsTeam",
                    "name" => $team["name"]
                ];
            }) : [],
            "type" => 'league'
        ];

        return [
            "name" => "{$league->name} {$league->season}",
            "name_ar" => "{$league->name_ar} {$league->season}",
            "meta_title" => $league->seo->meta_title,
            "meta_title_ar" => $league->seo->meta_title_ar,
            "meta_desc" => $league->seo->meta_desc,
            "meta_desc_ar" => $league->seo->meta_desc_ar,
            "keywords" => $league->seo->keywords,
            "keywords_ar" => $league->seo->keywords_ar,
            "country" => @$league->country->name ?? "",
            "image" => $league->logo,
            "url" => route('index.league', ["slug" => $league->slug]),
            "published" => Carbon::parse($league->getRawOriginal('created_at'))->format("Y-m-d H:m:s"),
            "modified" => Carbon::parse($league->getRawOriginal('updated_at'))->format("Y-m-d H:m:s"),
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
                    "name" => $league->name,
                    "item" => route('index.league', ["slug" => $league->slug])
                ],
            ],
            "members" => !empty($teams) ? collect($teams)->map(function ($team) {
                return [
                    "@type" => "SportsTeam",
                    "name" => $team["name"]
                ];
            }) : [],
            "type" => 'league'
        ];
    }
}
