<?php

namespace App\Transformers;

use App\Models\Team;
use Carbon\Carbon;
use League\Fractal\TransformerAbstract;

use function PHPUnit\Framework\greaterThanOrEqual;

class LeagueFixtureTransformer extends TransformerAbstract
{
    public $season;
    public function __construct($season)
    {
        $this->season = $season;
    }

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
    public function transform($fixture)
    {
        $matches = [];

        if (count(@$fixture["match"])) {
            $userTz = @getUserLocation()?->time_zone?->name ?? 'Asia/Qatar';

            foreach (@$fixture["match"] as $index => $match) {
                $type = gettype($match);

                if ($type == 'array') {
                    $localHasLogo = Team::whereTeamId(@$match["localteam"]["@id"])->first(["image"]);
                    $visitorHasLogo = Team::whereTeamId(@$match["visitorteam"]["@id"])->first(["image"]);

                    $dateString = explode(".", @$match["@date"]);

                    $next = Carbon::create($dateString[2], $dateString[1], $dateString[0], 0, 0, 0, $userTz);
                    $now = Carbon::create(now()->year, now()->month, now()->day, 0, 0, 0, $userTz);

                    $sort = @$match['@date']+" "+ @$match["@time"];

                    $matches[$index] = [
                        "date" => Carbon::parse(@$match["@date"])->format("M d, Y"),
                        "isNext" => $next->gte($now),
                        "time" => Carbon::parse(@$match["@time"], $userTz)->format("h:i A"),
                        "sort" => $sort,
                        "status" => @$match["@status"],
                        "venue" => @$match["@venue"],
                        "venueCity" => @$match["@venue_city"],
                        "attendance" => @$match["@attendance"],
                        "homeTeam" => [
                            "teamId" => @$match["localteam"]["@id"],
                            "logo" => @$localHasLogo->image ?: null,
                            "name" => @$match["localteam"]["@name"],
                            "score" => (int) @$match["localteam"]["@score"],
                            "ftScore" => (int) @$match["localteam"]["@ft_score"],
                            "etScore" => (int) @$match["localteam"]["@et_score"],
                            "penScore" => (int) @$match["localteam"]["@pen_score"],
                        ],
                        "awayTeam" => [
                            "teamId" => @$match["visitorteam"]["@id"],
                            "logo" => @$visitorHasLogo->image ?: null,
                            "name" => @$match["visitorteam"]["@name"],
                            "score" => (int) @$match["visitorteam"]["@score"],
                            "ftScore" => (int) @$match["visitorteam"]["@ft_score"],
                            "etScore" => (int) @$match["visitorteam"]["@et_score"],
                            "penScore" => (int) @$match["visitorteam"]["@pen_score"],
                        ]
                    ];
                }
            }
        }

        return [
            "id" => $fixture["@number"],
            "week" => $fixture["@number"],
            "season" => $this->season,
            "matches" => $matches,
        ];
    }
}
