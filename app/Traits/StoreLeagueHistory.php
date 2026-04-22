<?php

namespace App\Traits;

use App\Models\SoccerLeagueHistory;
use Illuminate\Support\Facades\Http;

trait StoreLeagueHistory
{

    public static function storeHistory($league, $season, $data) {
        $history = new SoccerLeagueHistory();
        $history->league_id = $league;
        $history->season = $season;
        $history->data = $data;
        $history->save();
    }


    public static function fetchHistory($endPoint, $key,$league, $season) {
        $response = Http::get("$endPoint/{$key}/soccerhistory/leagueid/$league-$season?json=1")->throw();

        return $response->collect();
    }
}
