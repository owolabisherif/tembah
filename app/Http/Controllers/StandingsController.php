<?php

namespace App\Http\Controllers;

use App\Enums\RefreshTime;
use App\Models\Standing;
use App\Transformers\StandingTransformer;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class StandingsController extends Controller
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
    public function __invoke($league, $season = "")
    {
        try {
            $res = Cache::remember("league-standings-now-$league", now()->addHours(2), function() use($league, $season) {
                $ext = $season == "" ? ".xml?json=1" : "?season={$season}&json=1";

                $standings = Standing::where(["league_id" => $league, "season" => $season])->first();

                if ($standings) return $this->getStandings(@$standings->data);

                if (isCurrentSeason($season)) {
                    return Cache::remember("standings-$league", RefreshTime::Fixtures->value, function () use ($league, $ext) {

                        $res = Http::get("{$this->endPoint}/{$this->key}/standings/{$league}{$ext}")->throw();

                        return $this->getStandings($res->collect()->toArray());
                    });
                }

                $res = Http::get("{$this->endPoint}/{$this->key}/standings/{$league}{$ext}")->throw();

                $data = $res->collect()->toArray();

                $this->storeStanding($league, $season, $data);

                return $this->getStandings($data);
            });

            return $res;
    
        } catch(RequestException $e)  {
            // return response()->json(["status" =>  false, "message" => $e->getMessage()], $e->response->status());
            return response()->json([]);
        } catch (\Exception $e)  {
            // return response()->json(["status" =>  false, "message" => $e->getMessage()], 500);
            return response()->json([]);
        }
    }
    
    public function getStandings($collection) {
        $table = array();
        $tournaments = @$collection["standings"]["tournament"];
        $isOneLevel = array_key_exists("team", $tournaments ?? []);

        if (!$isOneLevel && $tournaments) {
            foreach ($tournaments as $item) {
                $table = [...$table, ...$item["team"]];
            }
        } else {
            $table = @$collection["standings"]["tournament"]["team"];
        }

        return fractal($table && count($table) > 0 ? collect($table) : [], new StandingTransformer())->toArray()["data"];
    }

    private function storeStanding($leagueId, $season, $data) {
        try {
        
           $standing = new Standing();
    
            $standing->league_id = $leagueId;
            $standing->season = $season;
            $standing->data = $data;
    
            $standing->save();

        } catch (\Exception $e) {
           Log::error($e->getMessage());
        }
    }
}
