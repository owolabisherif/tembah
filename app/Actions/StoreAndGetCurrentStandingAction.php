<?php


namespace App\Actions;

use App\Models\League;
use App\Models\Standing;
use App\Transformers\StandingTransformer;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class StoreAndGetCurrentStandingAction {
    public static function handle(League $league) {
        try {
            $key =  config('api.key');
            $endPoint = config('api.endpoint');
            $season = str_replace('/', '-', $league->season);
            $ext = "?season={$season}&json=1";

            $standings = Standing::where(["league_id" => $league->league_id, "season" => $season])->first();

            if ($standings) return self::getStandings(@$standings->data);

            $res = Http::get("{$endPoint}/{$key}/standings/{$league->league_id}{$ext}")->throw();
            $data = $res->collect()->toArray();

            $standing = new Standing();
            $standing->league_id = $league->league_id;
            $standing->season = $season;
            $standing->data = $data;

            $standing->save();

            return self::getStandings($data);
       
        } catch (\Exception $e) {
            Log::error($e);

            return [];
        }
    }


    private static function getStandings($collection)
    {
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
}