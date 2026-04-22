<?php

namespace App\Transformers;

use App\Models\Team;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use League\Fractal\TransformerAbstract;

class TransferTransformer
{
    private array $data;

    public function __construct(array $data )
    {
        $this->data = $data;
    }

    

    /**
     * A Fractal transformer.
     *
     * @return array
     */
    public function transform()
    {
        $transfers = array();
        if(count($this->data) <= 0) return $transfers;
        
        $userTz = @getUserLocation()?->time_zone?->name ?? 'Asia/Qatar';

        foreach ($this->data as $transfer) {
            $fromTeam = Team::whereTeamId(@$transfer["@from_id"])->first(["image"]);
            $toTeam = Team::whereTeamId(@$transfer["@to_id"])->first(["image"]);

            $sort = Carbon::parse(@$transfer['@date'] . " " . @$transfer["@time"])->setTimezone($userTz)->timestamp;

            $transfers[] = [
                "id" => (int) @$transfer["@id"],
                "name" => @$transfer["@name"],
                "slug" => Str::slug(@$transfer["@name"]),
                "image" => "",
                "age" => @$transfer["@age"],
                "position" => @$transfer["@position"],
                "type" => @$transfer["@type"],
                "price" => @$transfer["@price"],
                "from" => [
                    "id" => (int) @$transfer["@from_id"],
                    "name" => @$transfer["@from"],
                    "slug" => Str::slug(@$transfer["@from"]),
                    "image" => $fromTeam ? $fromTeam["image"] : ""
                ],
                "to" => [
                    "id" => (int) @$transfer["@to_id"],
                    "name" => @$transfer["@to"],
                    "slug" => Str::slug(@$transfer["@to"]),
                    "image" => $toTeam ? $toTeam["image"] : ""
                ],
                "sort" => $sort,
                "date" => Carbon::parse(@$transfer["@date"])->setTimezone($userTz)->format("M d, Y"),
            ];
        }

        usort($transfers, fn($a, $b) => $b["sort"] <=> $a["sort"]);

        // Log::info($transfers);

        return $transfers;
    }
}
