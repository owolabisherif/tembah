<?php

namespace App\Transformers;

use App\Models\League;
use League\Fractal\TransformerAbstract;

class TopLeaguesTranformer extends TransformerAbstract
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
            "country" => $league->country,
            "slug" => $league->slug,
            "slugAr" => $league->slug_ar,
            "name" => $league->name,
            "nameAr" => $league->name_ar,
            "logo" => $league->logo,
            "sort" => $league->sort,
        ];
    }
}
