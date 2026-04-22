<?php

namespace App\Http\Controllers;

use App\Actions\StorePlayerAction;
use App\Models\Player;
use App\Models\Team;
use App\Transformers\PlayerTransformer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ShowPlayerController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke($player, $shirt, $slug)
    {
        return Inertia::render("player/index", [
            "slug" => $slug,
            "player" => Inertia::defer(function() use($player, $shirt) {
                $actor = Player::wherePlayerId($player)->first();

                if (!$actor) {
                    $actor = StorePlayerAction::handle($player, $shirt);
                }

                if($actor->reload == 1) {
                    $actor = StorePlayerAction::handle($player, $shirt);
                }

                if($shirt != $actor->shirt) {
                    $actor = StorePlayerAction::handle($player, $shirt);
                }

                return fractal($actor, new PlayerTransformer())->toArray()["data"];
            })
        ]);
    }
}
