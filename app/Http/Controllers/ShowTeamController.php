<?php

namespace App\Http\Controllers;

use App\Actions\StoreTeamAction;
use App\Models\League;
use App\Models\Team;
use App\Transformers\TeamTransformer;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ShowTeamController extends Controller
{
    private $key;
    private $endPoint;

    public function  __construct()
    {
        $this->key =  config('api.key');
        $this->endPoint = config('api.endpoint');
    }

    /**
     * Handle the incoming request.
     */
    public function index($ids, $slug)
    {
        $ids = explode("-", $ids);

        [$teamId, $leagueId] = count($ids) > 1 ? $ids : [...$ids, null];

        $model = Team::with(["country", "seo"])->whereTeamId($teamId);

        $team = $model->first();

        if (!$team) {
            $team = StoreTeamAction::handle($teamId);
        }

        if (!$team->country_id) {
            $team = StoreTeamAction::handle($teamId);
        }

        if ($team->reload == 1) {
            $team = StoreTeamAction::handle($teamId);
        }

        $team = !$team ? null : fractal($team, TeamTransformer::class)->toArray()["data"];

        return Inertia::render("show-team/index", [
            "slug" => $slug,
            "league" => $leagueId,
            "team" => Inertia::defer(fn() => $team),
            "seo" => $this->getTeamSEO($model->first())
        ]);
    }


    private function getTeamSEO(Team $team): array
    {
        $leagueIds = json_decode($team->leagues);

        $leagues = Cache::rememberForever("{$team->name}-leagues-member-of", function () use($leagueIds) {
            return League::whereIn("league_id", $leagueIds->league_id)->get();
        });

        $athletes = getTeamSquad(json_decode($team->squad));
        $coach = getTeamCoach(json_decode($team->coach));

        if (!$team->seo) return [
            "name" => "{$team->name} | Tembah",
            "name_ar" => "{$team->name_ar} | Tembah",
            "meta_title" => "{$team->name} | Tembah",
            "meta_title_ar" => "{$team->name_ar} | Tembah",
            "image" => $team->image,
            "country" => @$team->country->name ?? "",
            "url" => route("soccer.show.team.index", ["ids" => $team->team_id, "slug" => $team->slug]),
            "published" => Carbon::parse($team->getRawOriginal('created_at'))->format("Y-m-d H:m:s"),
            "modified" => Carbon::parse($team->getRawOriginal('updated_at'))->format("Y-m-d H:m:s"),
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
                    "name" => $team->name,
                    "item" => route("soccer.show.team.index", ["ids" => $team->team_id, "slug" => $team->slug]),
                ],
            ],
            "members" => $leagues->count() ? $leagues->map(function ($league) {
                return [
                    "@type" => "SportsOrganization",
                    "name" => $league->name,
                    "sport" => "Football",
                ];
            }) : [],
            "athletes" => !empty($athletes) ? collect($athletes)->map(function ($person) {
                return [
                    "@type" => "Person",
                    "name" => $person['name'],
                ];
            }) : [],
            "coach" => $coach ? [
                "@type" => "Person",
                "name" => $coach['name'],
            ] : [],
            "type" => 'team'
        ];

        return [
            "name" => "{$team->name} | Tembah",
            "name_ar" => "{$team->name_ar} | Tembah",
            "meta_title" => $team->seo->meta_title,
            "meta_title_ar" => $team->seo->meta_title_ar,
            "meta_desc" => $team->seo->meta_desc,
            "meta_desc_ar" => $team->seo->meta_desc_ar,
            "keywords" => $team->seo->keywords,
            "keywords_ar" => $team->seo->keywords_ar,
            "country" => @$team->country->name ?? "",
            "image" => $team->image,
            "url" => route("soccer.show.team.index", ["ids" => $team->team_id, "slug" => $team->slug]),
            "published" => Carbon::parse($team->getRawOriginal('created_at'))->format("Y-m-d H:m:s"),
            "modified" => Carbon::parse($team->getRawOriginal('updated_at'))->format("Y-m-d H:m:s"),
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
                    "name" => $team->name,
                    "item" => route("soccer.show.team.index", ["ids" => $team->team_id, "slug" => $team->slug])
                ],
            ],
            "members" => !empty($teams) ? collect($teams)->map(function ($team) {
                return [
                    "@type" => "SportsOrganization",
                    "name" => $team["name"],
                    "sport" => "Football",
                ];
            }) : [],
            "type" => 'team'
        ];
    }

    /**
     * Handle the incoming request.
     */
    public function show(Request $request)
    {

        $req = Http::get("{$this->endPoint}/{$this->key}/soccerstats/team/{$request->id}?json=1");
        
        $data = $req->collect();

        return response()->json($data);
    }
}
