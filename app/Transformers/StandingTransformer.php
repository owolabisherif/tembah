<?php

namespace App\Transformers;

use App\Models\Team;
use League\Fractal\TransformerAbstract;
use Illuminate\Support\Str;

class StandingTransformer extends TransformerAbstract
{
    /**
     * List of resources to automatically include
     *
     * @var array
     */
    protected array $defaultIncludes = [
        //
    ];

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected array $availableIncludes = [
        //
    ];

    /**
     * A Fractal transformer.
     *
     * @return array
     */
    public function transform($standing)
    {
        $id = @$standing["@id"] ?? @$standing["id"];
        $hasLogo = Team::whereTeamId($id)->first(["image"]);

        return [
            "id" => @$standing["@id"] ?? @$standing["id"],
            "name" => @$standing["@name"] ?? @$standing["name"],
            "logo" => @$hasLogo->image ?: null,
            "position" => @$standing["@position"] ?? @$standing["position"],
            "recentForm" => @$standing["@recent_form"] ?? @$standing["recent_form"],
            "status" => @$standing["@status"] ?? @$standing["status"],
            "inChampions" => Str::contains(Str::lower(@$standing["description"]["@value"] ?? @$standing["description"]["value"]), "champions league"),
            "inEuropa" => Str::contains(Str::lower(@$standing["description"]["@value"] ?? @$standing["description"]["value"]), "europa league"),
            "inConference" => Str::contains(Str::lower(@$standing["description"]["@value"] ?? @$standing["description"]["value"]), "conference league"),
            "inRelegation" => Str::contains(Str::lower(@$standing["description"]["@value"] ?? @$standing["description"]["value"]), "relegation"),
            "away" => [
                "d" => @$standing["away"]["@d"] ?? @$standing["away"]["d"],
                "ga" => @$standing["away"]["@ga"] ?? @$standing["away"]["ga"],
                "gp" => @$standing["away"]["@gp"] ?? @$standing["away"]["gp"],
                "gs" => @$standing["away"]["@gs"] ?? @$standing["away"]["gs"],
                "l" => @$standing["away"]["@l"] ?? @$standing["away"]["l"],
                "p" => @$standing["away"]["@p"] ?? @$standing["away"]["p"],
                "w" => @$standing["away"]["@w"] ?? @$standing["away"]["w"],
                "gd" => "0"
            ],
            "home" => [
                "d" => @$standing["home"]["@d"] ?? @$standing["home"]["d"],
                "ga" => @$standing["home"]["@ga"] ?? @$standing["home"]["ga"],
                "gp" => @$standing["home"]["@gp"] ?? @$standing["home"]["gp"],
                "gs" => @$standing["home"]["@gs"] ?? @$standing["home"]["gs"],
                "l" => @$standing["home"]["@l"] ?? @$standing["home"]["l"],
                "p" => @$standing["home"]["@p"] ?? @$standing["home"]["p"],
                "w" => @$standing["home"]["@w"] ?? @$standing["home"]["w"],
                "gd" => "0"
            ],
            "overall" => [
                "d" => @$standing["overall"]["@d"] ?? @$standing["overall"]["d"],
                "ga" => @$standing["overall"]["@ga"] ?? @$standing["overall"]["ga"],
                "gp" => @$standing["overall"]["@gp"] ?? @$standing["overall"]["gp"],
                "gs" => @$standing["overall"]["@gs"] ?? @$standing["overall"]["gs"],
                "l" => @$standing["overall"]["@l"] ?? @$standing["overall"]["l"],
                "w" => @$standing["overall"]["@w"] ?? @$standing["overall"]["w"],
            ],
            "total" => [
                "gd" => @$standing["total"]["@gd"] ? trim(@$standing["total"]["@gd"], "+") : trim(@$standing["total"]["gd"], "+"),
                "p" => @$standing["total"]["@p"] ?? @$standing["total"]["p"],
            ]
        ];
    }
}
