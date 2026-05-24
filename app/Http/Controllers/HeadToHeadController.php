<?php

namespace App\Http\Controllers;

use App\Models\Fixture;
use App\Transformers\Head2HeadTransformer;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class HeadToHeadController extends Controller
{
    private $key;
    private $endPoint;

    public function  __construct()
    {
        $this->key =  config('api.key');
        $this->endPoint = config('api.endpoint');
    }

    public function __invoke($slug)
    {
        try {
            $fixture = Fixture::whereSlug($slug)->first();
    
            $match = (object) $fixture->match;
    
            $team1 = @$match->homeTeam["teamId"];
            $team2 = @$match->awayTeam["teamId"];
    
            if(!$team1 || !$team2) return [];
            
            $req = Http::get("{$this->endPoint}/{$this->key}/h2h/$team1/$team2?json=1");
    
            $data = $req->collect();
    
            $data = Head2HeadTransformer::transform($data["h2h"]);
    
            $data["homeTeam"]["imageUrl"] = @$match->homeTeam["logo"];
            $data["awayTeam"]["imageUrl"] = @$match->awayTeam["logo"];

    
            return response()->json($data);
        } catch (\Exception $e) {
            throw $e;
        }
    }
}
