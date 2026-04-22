<?php

namespace App\Http\Controllers;

use App\Models\Fixture;
use App\Models\League;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class MatchController extends Controller
{
    public function index($period = "today")
    {
        return Inertia::render("match", [
            "period" => $period,
        ]);
    }


    public function show($slug) {
        $data = [];
        $leagueData = [];
        $fixture = Fixture::whereSlug($slug);
        $fix = $fixture->exists() ?  $fixture->first() : null;


        if($fix) {
            $league = League::whereLeagueId($fix->league_id)->first();
            
            $leagueData = [
                "id" => $league->id,
                "sort" => $league->sort,
                "leagueId" => $league->league_id,
                "slug" => $league->slug,
                "slugAr" => $league->slug_ar,
                "name" => $league->name,
                "nameAr" => $league->name_ar,
                "logo" => $league->logo,
                "country" => $league->country,
                "season" => "",
            ];

            $data = [
                "id" => $fix->id,
                "league" => $fix->league,
                "leagueId" => $fix->league,
                "leagueData" => $leagueData,
                "imageUrl" => null,
                "country" => $fix->country,
                "sort" => $fix->sort,
                "match" => $fix->match,  
            ];
        }

        return Inertia::render("show-match", [
            "slug" => $slug,
            "fixture" => Inertia::defer(fn() => $fix ? $data : null)
        ]);
    }
}
