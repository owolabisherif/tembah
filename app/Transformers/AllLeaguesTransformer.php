<?php

namespace App\Transformers;

use App\Models\Country;
use League\Fractal\TransformerAbstract;

class AllLeaguesTransformer extends TransformerAbstract
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
    public function transform(Country $country)
    {
        return [
            "id" => $country->id,
            "slug" => $country->slug,
            "slugAr" => $country->slug_ar,
            "name" => $country->name,
            "nameAr" => $country->name_ar,
            "sort" => $country->sort,
            "logo" => $country->logo,
            "leagues" => $country->leagues->map(fn($lg) => [
                "id" => $lg->id,
                "leagueId" => $lg->league_id,
                "slug" => $lg->slug,
                "slugAr" => $lg->slug_ar,
                "name" => $lg->name,
                "nameAr" => $lg->name_ar,
                "logo" => $lg->logo,
                "sort" => $lg->sort,
            ]),
        ];
    }
}
