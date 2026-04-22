<?php

namespace App\Http\Controllers;

use App\Actions\StoreTeamAction;
use App\Models\Team;
use App\Transformers\TeamTransformer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ShowTeamController extends Controller
{
    private $key;
    private $endPoint;

    public function  __construct()
    {
        $this->key =  env("GOAL_SERVE_KEY");
        $this->endPoint = env("GOAL_SERVE_ENDPOINT");
    }

    /**
     * Handle the incoming request.
     */
    public function index($ids, $slug)
    {
        $ids = explode("-", $ids);

        [$teamId, $leagueId] = count($ids) > 1 ? $ids : [...$ids, null];

        // Log::info($leagueId);

        return Inertia::render("show-team/index", [
            "slug" => $slug,
            "league" => $leagueId,
            "team" => Inertia::defer(function() use ($teamId) {
                
                $team = Team::with(["country"])->whereTeamId($teamId)->first();

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

                return $team;
            }),
        ]);
    }


    private function render($slug) {}

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
