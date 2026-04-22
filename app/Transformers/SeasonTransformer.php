<?php

namespace App\Transformers;

use App\Models\Season;
use League\Fractal\TransformerAbstract;

class SeasonTransformer extends TransformerAbstract
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
    public function transform(Season $season)
    {
        return [
            "id" => $season->id,
            "leagueId" => $season->league_id,
            "seasons" => $season->seasons,
        ];
    }
}
