<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Team;
use App\Transformers\TransferTransformer;
use Illuminate\Support\Facades\Log;
use stdClass;

class TransfersController extends Controller
{
    public function __invoke($league) {
        $teams = Team::whereJsonContains("leagues->league_id", $league)->get();

        if (!$teams->count()) return [];

        $transfers = array();

        foreach ($teams as $value) {
            $data = gettype($value["transfers"]) == "string" ? (array) json_decode($value["transfers"], true) : $value["transfers"];

            $inPlayers = (array) @$data["in"]["player"];
            $outPlayers = (array) @$data["out"]["player"];

            if (@$inPlayers && is_array($inPlayers)) {
                foreach ($data["in"]["player"] as $player) {
                    
                    $player["@from_id"] = @$player["@team_id"];

            
                    // $player["@fom_name"] = @$player["@from"];
                    $player["@to_id"] = $value["team_id"];
                    $player["@to"] = $value["name"];
                    array_push($transfers, (array) $player);
                }
            }

            if (@$outPlayers && is_array($outPlayers)) {
                foreach ($data["out"]["player"] as $player) {
                    $player["@to_id"] = @$player["@team_id"];
                  
                    // $player["@to_name"] = @$player["@to"];
                    $player["@from_id"] = $value["team_id"];
                    $player["@from"] = $value["name"];
                    array_push($transfers, (array) $player);
                }
            }
        }

        $transfers = (new TransferTransformer($transfers))->transform();

        return response()->json($transfers);
    }
}
