<?php

namespace App\Http\Controllers;

use App\Models\Country;
use Illuminate\Support\Facades\Cache;
use App\Enums\Status;
use App\Transformers\AllLeaguesTransformer;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class AllLeaguesController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke()
    {

        $allLeagues = Cache::rememberForever("all-leagues",  function () {

            $userCountry = getUserLocation()?->location?->country_name ?? "Qatar";

            $leagues = Country::whereStatus(Status::ACTIVE)->with(["leagues" => function ($q) {
                $q->orderBy("name", "ASC");
            }])->orderBy("sort", "ASC")->orderBy("name", "ASC")->get()->transformWith(new AllLeaguesTransformer())->toArray()["data"];

            [$localeLeague, $otherLeagues] = Arr::partition($leagues, function ($country) use ($userCountry) {
                return $country["name"] == Str::lower($userCountry);
            });

            return [...$localeLeague, ...$otherLeagues];
        });

        return $allLeagues;
    }
}
