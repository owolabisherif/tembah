<?php

namespace App\Http\Controllers;

use App\Enums\RefreshTime;
use App\Models\SoccerLeagueHistory;
use App\Traits\StoreLeagueHistory;
use App\Transformers\LeagueStatCustomTransformer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Transformers\LeagueStatTransformer;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class SoccerLeagueStatController extends Controller
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
        //https://www.goalserve.com/getfeed/3fc72403f8ca48d0457308d8948a9c44/soccerleague/1229?json=1
        try {

            $history = SoccerLeagueHistory::where(["league_id" => $league, "season" => $season])->first();
            $ints = new LeagueStatCustomTransformer($season);

            if ($history) {
                return $ints->getStats($history->data)->result();
            }
            
            if(isCurrentSeason($season)) {
                return Cache::remember("stat-history-$league-$season", now()->addMinutes(RefreshTime::Fixtures->value), function() use($league, $season, $ints) {
                    $response = $this->fetchHistory($this->endPoint,$this->key,$league, $season);

                    return $ints->getStats($response->toArray())->result();
                });
            }

            $response = $this->fetchHistory($this->endPoint, $this->key, $league, $season);

            $this->storeHistory($league, $season, $response->toArray());

            return $ints->getStats($response->toArray())->result();

        } catch(RequestException $e) {
            Log::error($e);
            return [];
            // return response()->json(["message" => $e->getMessage(), "status" => false], $e->response->status());
        } catch (\Exception $e) {
            Log::error($e);  
            return [];
            // return response()->json(["error" => $e->getMessage(), "status" => false], 500);
        }
    }
}
