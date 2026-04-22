<?php

namespace App\Http\Controllers;

use App\Models\Team;
use Illuminate\Http\Request;

class ShowTeamPlayerController extends Controller
{
    public function __invoke($team) 
    {
        $teams = Team::find($team)->get();

        if(!$teams->count()) return [];

        $players = array();

        // return $teams;

        foreach ($teams as $value) {
            if(@$value["squad"]["player"] && is_array($value["squad"]["player"])) {
                foreach($value["squad"]["player"] as $player) {
                    array_push($players, (int) $player["@id"]);
                }
            }


            if(@$value["transfers"]["in"]["player"] && is_array($value["transfers"]["in"]["player"])) {
                foreach($value["transfers"]["in"]["player"] as $player) {
                    array_push($players, (int) $player["@id"]);
                }
            }

            if(@$value["transfers"]["out"]["player"] && is_array($value["transfers"]["out"]["player"])) {
                foreach($value["transfers"]["out"]["player"] as $player) {
                    array_push($players, (int) $player["@id"]);
                }
            }

            if(@$value["sidelined"]["player"] && is_array($value["sidelined"]["player"])) {
                foreach($value["sidelined"]["player"] as $player) {
                    array_push($players, (int) $player["@id"]);
                }
            }
        }

        $players = array_unique($players);

        return $players;
    }
}
