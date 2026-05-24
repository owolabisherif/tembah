<?php

namespace App\Http\Controllers;

use App\Actions\StorePlayerAction;
use App\Models\Player;
use App\Models\Team;
use App\Transformers\PlayerTransformer;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Support\Str;
use NumberFormatter;

class ShowPlayerController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke($player, $shirt, $slug)
    {
        $actor = Player::with(["seo", "currentTeam"])->wherePlayerId($player)->first();

        if (!$actor) {
            $actor = StorePlayerAction::handle($player, $shirt);
        }

        if ($actor->reload == 1) {
            $actor = StorePlayerAction::handle($player, $shirt);
        }

        if ($shirt != $actor->shirt) {
            $actor = StorePlayerAction::handle($player, $shirt);
        }

        $footballer = fractal($actor, new PlayerTransformer())->toArray()["data"];

        return Inertia::render("player/index", [
            "slug" => $slug,
            "player" => Inertia::defer(fn() => $footballer),
            "seo" => $this->getPlayerSEO($actor)
        ]);
    }



    private function getPlayerSEO(Player $player): array
    {

        $fmt = new NumberFormatter('en_US', NumberFormatter::CURRENCY);
        $trophies = $player->trophies && $player->trophies != 'null' ? json_decode($player->trophies) : null;

        $awards = getPlayerTrophies($trophies->trophy);
        
        if (!$player->seo) return [
            "name" => "{$player->name}",
            "name_ar" => "{$player->name_ar}",
            "meta_title" => "{$player->name} | Tembah",
            "meta_title_ar" => "{$player->name_ar} | Tembah",
            "image" => $player->image,
            "country" => $player->birth_country,
            "identifier" => $player->player_id,
            "nationality" => $player->nationality,
            "net_worth" =>  $fmt->formatCurrency($player->market_value, 'EUR'),
            "weight" => $player->weight,
            "url" => route("show.player", ["player" => $player->player_id, "shirt" => $player->shirt, "slug" => $player->slug]),
            "published" => Carbon::parse($player->getRawOriginal('created_at'))->format("Y-m-d H:m:s"),
            "modified" => Carbon::parse($player->getRawOriginal('updated_at'))->format("Y-m-d H:m:s"),
            "birth_date" => $player->birthdate,
            "awards" => count($awards) ? collect($awards)->map(function($award) {

                $name =  $award["league"]." (".implode(', ', $award["seasons"]).")";

                return [
                    "@type" => "Text",
                    "name" => $name
                ];
            }) : [],
            "birth_place" => [
                "@type" => "Place",
                "name" => $player->birth_place,
            ],
            "height" => $player->height,
            "job_title" => "Footballer",
            "breadcrumb" => [
                [
                    "@type" => "ListItem",
                    "position" => 1,
                    "name" => "Tembah | Welcome",
                    "item" => "https://tembah.net/"
                ],
                [
                    "@type" => "ListItem",
                    "position" => 2,
                    "name" => $player->team,
                    "item" => route("soccer.show.team.index", ["ids" => $player->team_id, "slug" => @$player->currentTeam->slug ?? Str::slug($player->team)])
                ],
                [
                    "@type" => "ListItem",
                    "position" => 3,
                    "name" => $player->name,
                    "item" => route("show.player", ["player" => $player->player_id, "shirt" => $player->shirt, "slug" => $player->slug]),
                ],
            ],
            "members" => [
                "@type" => "SportsTeam",
                "name" => $player->team
            ],
            "affiliation" => [
                "@type" => "SportsTeam",
                "name" => $player->team
            ],
            "works_for" => [
                "@type" => "SportsTeam",
                "name" => $player->team
            ],
            "type" => 'person'
        ];

        return [
            "name" => "{$player->name} | Tembah",
            "name_ar" => "{$player->name_ar} | Tembah",
            "meta_title" => $player->seo->meta_title,
            "meta_title_ar" => $player->seo->meta_title_ar,
            "meta_desc" => $player->seo->meta_desc,
            "meta_desc_ar" => $player->seo->meta_desc_ar,
            "keywords" => $player->seo->keywords,
            "keywords_ar" => $player->seo->keywords_ar,
            "country" => $player->birth_country,
            "image" => $player->image,
            "nationality" => $player->nationality,
            "net_worth" => $player->market_value,
            "weight" => $player->weight,
            "height" => $player->height,
            "url" => route("show.player", ["player" => $player->player_id, "shirt" => $player->shirt, "slug" => $player->slug]),
            "published" => Carbon::parse($player->getRawOriginal('created_at'))->format("Y-m-d H:m:s"),
            "modified" => Carbon::parse($player->getRawOriginal('updated_at'))->format("Y-m-d H:m:s"),
            "birth_date" => $player->birthdate,
            "birth_place" => [
                "@type" => "Place",
                "name" => $player->birth_place,
            ],
            "breadcrumb" => [
                [
                    "@type" => "ListItem",
                    "position" => 1,
                    "name" => "Tembah | Welcome",
                    "item" => "https://tembah.net/"
                ],
                [
                    "@type" => "ListItem",
                    "position" => 2,
                    "name" => $player->team,
                    "item" => route("soccer.show.team.index", ["ids" => $player->team_id, "slug" => @$player->currentTeam->slug ?? Str::slug($player->team)])
                ],
                [
                    "@type" => "ListItem",
                    "position" => 3,
                    "name" => $player->name,
                    "item" => route("show.player", ["player" => $player->player_id, "shirt" => $player->shirt, "slug" => $player->slug]),
                ],
            ],
            "members" => [
                "@type" => "SportsTeam",
                "name" => $player->team
            ],
            "affiliation" => [
                "@type" => "SportsTeam",
                "name" => $player->team
            ],
            "works_for" => [
                "@type" => "SportsTeam",
                "name" => $player->team
            ],
            "type" => 'person'
        ];
    }
}
