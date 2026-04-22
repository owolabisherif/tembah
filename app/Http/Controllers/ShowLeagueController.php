<?php

namespace App\Http\Controllers;

use App\Models\League;
use App\Transformers\LeaguesTranformer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShowLeagueController extends Controller
{
    public function __invoke(string $slug)
    {

        $model = isArabic($slug) ? League::with(["country"])->whereSlugAr($slug) : League::with(["country"])->whereSlug($slug);

        $league = fractal($model->first(), new LeaguesTranformer)->toArray()["data"];

        return Inertia::render("show-league", [
            "league" => Inertia::defer(fn() => $league)
        ]);
    }
}
