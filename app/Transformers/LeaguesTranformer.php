<?php

namespace App\Transformers;

use League\Fractal\TransformerAbstract;
use App\Models\League;

class LeaguesTranformer extends TransformerAbstract
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
    public function transform(League $league)
    {
        return [
            "id" => $league->id,
            "leagueId" => $league->league_id,
            "slug" => $league->slug,
            "slugAr" => $league->slug_ar,
            "name" => $league->name,
            "nameAr" => $league->name_ar,
            "logo" => $league->logo,
            "sort" => $league->sort,
            "country" => [
                "id" => @$league?->country?->id,
                "name" => @$league?->country?->name,
                "nameAr" => @$league?->country?->name_ar,
                "name_ar" => @$league?->country?->name_ar,
            ]
        ];
    }
}
