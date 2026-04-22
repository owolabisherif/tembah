<?php

namespace App\Http\Controllers;

use App\Models\League;
use Illuminate\Support\Facades\Cache;
use App\Enums\Status;
use App\Transformers\TopLeaguesTranformer;



class TopLeaguesController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke()
    {
        $topLeagues = Cache::rememberForever("top-leagues",  function () {
            return League::where(function ($q) {
                $q->where(["status" => Status::ACTIVE, "is_top" => Status::ACTIVE]);
            })->orderBy("name", "ASC")->get()->transformWith(new TopLeaguesTranformer())->toArray()["data"];
        });

        return $topLeagues;
    }
}
