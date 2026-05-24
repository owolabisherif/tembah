<?php

namespace App\Http\Controllers;

use App\Enums\RefreshTime;
use App\Models\SoccerLeagueHistory;
use App\Traits\StoreLeagueHistory;
use App\Transformers\LeagueFixtureCustomTransformer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Transformers\LeagueFixtureTransformer;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class SoccerLeagueFixtureController extends Controller
{
    use StoreLeagueHistory;

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
    public function __invoke($league, $season)
    {
        //https://www.goalserve.com/getfeed/3fc72403f8ca48d0457308d8948a9c44/soccerhistory/leagueid/1093-2024-2025?json=1
        try {
            
            $history = SoccerLeagueHistory::where(["league_id" => $league, "season" => $season])->first();
            $inst = new LeagueFixtureCustomTransformer($season);

            if($history) {
                return response()->json($inst->getFixtures($history->data)->result());
            }

            if(isCurrentSeason($season)) {
                return Cache::remember("league-fixtures-$league-$season", now()->addMinutes(RefreshTime::Fixtures->value), function() use($league, $season, $inst) {
                    $response = $this->fetchHistory($this->endPoint,$this->key,$league, $season);

                    return $inst->getFixtures($response->toArray())->result();
                });
            }

            $response = $this->fetchHistory($this->endPoint, $this->key, $league, $season);

            $collection = $response->toArray();

            $this->storeHistory($league, $season, $collection);

            return response()->json($inst->getFixtures($collection)->result());

        } catch(RequestException $e) {
            return response()->json(["message" => $e->getMessage(), "status" => false], $e->response->status());
        } catch (\Exception $e) {
            return response()->json(["message" => $e->getMessage(), "status" => false], 500);
        }
    }
}
