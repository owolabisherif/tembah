<?php

namespace App\Http\Controllers;

use App\Actions\GameCalenderGeneratorAction;
use App\Actions\GetGamesAction;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use ArPHP\I18N\Arabic;
use Carbon\Carbon;
use App\Enums\Status;
use App\Jobs\StoreHistoricalFixturesJob;
use App\Models\Country;
use App\Models\Fixture;
use App\Models\HistoricalFixture;
use App\Models\League;
use App\Models\Season;
use App\Models\Team;
use App\Services\Cacher;
use App\Transformers\GameTransformer;
use App\Transformers\LeagueFixtureCustomTransformer;
use App\Transformers\LeagueFixtureTransformer;
use App\Transformers\StoredGameTransformer;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Log;
use stdClass;

class SoccerController extends Controller
{
    private $key;
    private $endPoint;
    private string $timezone;

    public function  __construct()
    {
        $this->key =  config('api.key');
        $this->endPoint = config('api.endpoint');
        $this->timezone = @getUserLocation()?->time_zone?->name ?? 'Asia/Qatar';
    }

    public function games($period = "home")
    {
        ini_set('max_execution_time', 0);
        $now = Carbon::now()->setTimezone($this->timezone)->format("Y-m-d");
        $yesterday = Carbon::now()->setTimezone($this->timezone)->subDay()->format("Y-m-d");
        $tomorrow = Carbon::now()->setTimezone($this->timezone)->addDay()->format("Y-m-d");

        try {
            //home - today, d1 - tommorrow, d-1 - yesterday
            $mods = [
                "home" => $now,
                "d-1" => $yesterday,
                "d1" => $tomorrow,
            ];

            $periods = GameCalenderGeneratorAction::handle();
            $filter = collect($periods)->first(fn($item) => $item["value"] == $period);

            $date = in_array($period, array_keys($mods)) ? $mods[$period] : $filter['label'];

            $fixtures = HistoricalFixture::where(['date' => $date])->first();
            
            if ($fixtures) return $fixtures->data;
                
            $games = GetGamesAction::make($period)->handle();

            if ($games instanceof stdClass) {
                $games = [$games];
            }

            $gameList = GameTransformer::make($games)->get();
            
            if(!empty($games)) StoreHistoricalFixturesJob::dispatch($gameList, $date);

            return response()->json($gameList);
            
        } catch (\Exception $e) {
            Log::error($e);

            $fixtures = HistoricalFixture::where(['date' => $now])->first();
            if ($fixtures) return $fixtures->data;

            return response()->json([]);
        }
    }



    public function live()
    {
        $date = Carbon::now()->format("Y-m-d");

        $games = Cache::remember("soccer-live-today-$date", Carbon::now()->addSeconds(60), function() {
            try {
                return GetGamesAction::make('live')->handle();
            } catch(\Exception $e) {
                Log::error($e);
                return [];
            }
        });
        
        if($games instanceof stdClass) {
            $games = [$games];
        }

        $res = response()->json(GameTransformer::make($games)->get());

        return $res;
    }

    public function getLeagueTeamData($leagueId = '1204')
    {
        $response = Http::get("{$this->endPoint}/{$this->key}/soccerleague/$leagueId?json=1");

        $collection = $response->collect();

        return $collection["league"]["team"];
    }

    public function teams()
    {
        ini_set('max_execution_time', 0);
        $response = Http::get("{$this->endPoint}/{$this->key}/soccerstats/team/updated_list?json=1");
        
        $collection = $response->collect();
        $collectionTeam = $collection["teams"]["team"];

        if (collect($collectionTeam)->count()) {
            foreach ($collectionTeam as $index => $team) {
                $teamsData[$index] = $team['id'];
                Team::updateOrCreate(["team_id" => $team['id']], [
                    "team_id" => $team['id'],
                    "reload" => 1
                ]);
            }
        }

        print("done");
    }


    public function getLeagueFixtures($leagueId = '1204', $start_date = '', $end_date = '')
    {
        try {            
            Cache::forget("league_fixtures_$leagueId");
            $response = Cache::remember("league_fixtures_$leagueId", now()->addHours(2), function () use ($leagueId, $start_date, $end_date) {
                $q = $start_date != '' & $end_date != '' ? "date_start=$start_date&date_end=$end_date" : '';
    
                $response = Http::get("{$this->endPoint}/{$this->key}/soccerfixtures/league/$leagueId?json=1&$q")->throw();
    
                $collection = $response->collect()->toArray();
    
    
                $inst = new LeagueFixtureCustomTransformer(@$collection["results"]["tournament"]["@season"], $leagueId);
    
                return $inst->getFixtures($collection)->result();
            });

            return response()->json($response);
        } catch(RequestException $e) {
            Log::error($e);
            return response()->json(["message" => $e->getMessage(), "status" => false], $e->response->status());
        } catch (\Exception $e) {
            Log::error($e);
            return response()->json(["error" => $e->getMessage(), "status" => false], 500);
        }
    }

    /*
        Returns all leagues - past and currently running.
    */
    public function fixtures()
    {
        $response = Http::get("{$this->endPoint}/{$this->key}/soccerfixtures/data/mapping?json=1");

        $collection = $response->object();

        dd($collection);
    }

    public function season()
    {
        $response = Http::get("{$this->endPoint}/{$this->key}/soccerfixtures/data/seasons?json=1");


        $seasonsData = @$response->collect()["seasons"]["league"];

        // return $seasonsData;

        $seasons = [];

        foreach ($seasonsData as $values) {
            $seasonList = [];
            if (@$values["results"]["season"]) {
                foreach ($values["results"]["season"] as $season) {
                    array_push($seasonList, $season);
                }

                $cl = collect($seasonList)->flatten()->map(fn($item) => trim($item, "-"));
                array_push($seasons, ["league_id" => $values["@id"], "seasons" => json_encode(array_unique($cl->toArray()))]);

                $seasonList = [];
            }
        }

        $records = Season::upsert($seasons, ["league_id"], ["seasons"]);

        dd("Total records affected: $records");
    }

    public function store()
    {
        try {
            $arabic = new Arabic();
            $response = Http::get("{$this->endPoint}/{$this->key}/soccerfixtures/data/mapping?json=1");

            $data = $response->collect();

            $leagues  = $data["fixtures"]["mapping"];

            DB::beginTransaction();

            $disabled = collect(["isreal", "israel", "isrel"]); //make fetchable from DB
            $international = collect(["intl", "intL", "intl.", "international"]);
            $tops = collect([""]);

            foreach ($leagues as $league) {
                $league_id = (int) $league["@id"];

                $countryName = $international->contains(Str::lower($league["@country"])) ? 'international' : Str::lower($league["@country"]);

                $country = Country::updateOrCreate(["slug" => Str::slug($countryName)], [
                    "slug" => Str::slug($countryName),
                    "sort" => $international->contains($countryName) ? 1 : 3000,
                    "logo" => (string) $league_id . ".png",
                    "slug_ar" => makeArabicSlug($arabic->en2ar($countryName)),
                    "name" => $countryName,
                    "name_ar" => $arabic->en2ar($countryName),
                    "status" => $disabled->contains($countryName) ? Status::INACTIVE : Status::ACTIVE
                ]);

                $country->logo = (string) $country->id . ".png";

                $country->save();

                League::updateOrCreate(["league_id" => $league_id], [
                    "league_id" => $league_id,
                    "slug" => makeSlug(new League(), $league["@name"]),
                    "slug_ar" => makeSlug(new League(), $arabic->en2ar($league["@name"]), 'slug_ar'),
                    "name" => $league["@name"],
                    "name_ar" => $arabic->en2ar($league["@name"]),
                    "status" => $disabled->contains(Str::lower($country->name)) ? Status::INACTIVE : Status::ACTIVE,
                    "country_id" => $country->id,
                    "season" => $league["@season"],
                    "logo" => (string) $league_id . ".png",
                    "is_cup" => $league["@iscup"] == "" ? false : (bool) ($league["@iscup"] == "False" ? false : true),
                    "is_women" => (bool) $league["@is_women"] == "" ? false : ($league["@is_women"] == "False" ? false : true),
                    "live_lineups" => (bool) $league["@live_lineups"] == "" ? false : ($league["@live_lineups"] == "False" ? false : true),
                    "live_stats" => (bool) $league["@live_stats"] == "" ? false : ($league["@live_stats"] == "False" ? false : true),
                    "live_pbp" => (bool) $league["@live_pbp"] == "" ? false : ($league["@live_pbp"] == "False" ? false : true),
                    "path" => $league["@path"],
                    "date_start" => Carbon::parse($league["@date_start"])->format("Y-m-d"),
                    "date_end" => Carbon::parse($league["@date_end"])->format("Y-m-d"),
                ]);
            }

            DB::commit();

            DB::afterCommit(function () {
                Cache::forget("all-leagues");
                echo ("Success");
            });
        } catch (\Exception $e) {
            dd($e->getMessage());


            DB::rollBack();
        }
    }
}
