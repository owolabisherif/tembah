<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use App\Models\Season;
use App\Transformers\SeasonTransformer;

class SeasonController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke($id)
    {
        $seasons = Cache::remember("league-seasons-$id", now()->addHours(2),  function () use ($id) {
            return fractal(Season::whereLeagueId($id)->first(), new SeasonTransformer())->toArray()["data"];
        });

        return $seasons;
    }
}
