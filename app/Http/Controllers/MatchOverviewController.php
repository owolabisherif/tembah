<?php

namespace App\Http\Controllers;

use App\Models\Fixture;
use App\Transformers\MatchOverviewTransformer;
use Illuminate\Http\Client\Pool;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MatchOverviewController extends Controller
{
    private $key;
    private $endPoint;

    public function  __construct()
    {
        $this->key =  config('api.key');
        $this->endPoint = config('api.endpoint');
    }
    /**
     * Handle the incoming request.
     */
    public function __invoke($slug)
    {
        try {
            $fixture = Fixture::whereSlug($slug)->first();

            if(!$fixture) return [];

            $responses = Http::pool(function(Pool $pool) use($fixture) {
                return [
                    $pool->as('predictions')->get("{$this->endPoint}/{$this->key}/commentaries/{$fixture->league_id}_predicted.xml?json=1"),
                    $pool->as('stats')->get("{$this->endPoint}/{$this->key}/commentaries/match?id={$fixture->static_id}&league={$fixture->league_id}&json=1"),
                ];
            });
            // $response = Http::get("{$this->endPoint}/{$this->key}/commentaries/{$fixture->league_id}_predicted.xml?json=1")->throw();
            // $response = Http::get("{$this->endPoint}/{$this->key}/soccerfixtures/{$fixture->league_id}/{$fixture->static_id}?json=1")->throw();
            // $response = Http::get("{$this->endPoint}/{$this->key}/commentaries/match?id={$fixture->static_id}&league={$fixture->league_id}&json=1")->throw();
            // $response = Http::get("{$this->endPoint}/{$this->key}/soccerleague/{$fixture->league_id}?json=1")->throw();

            $predictions = $responses["predictions"]?->collect();
            $stats = $responses["stats"]?->collect();

            $statsData = @$stats["commentaries"]["tournament"]["match"] ?? [];
            $predictionsData = @$predictions["commentaries"]["tournament"]["match"];


            if($predictionsData) {
                $predictionsData = collect($predictionsData)->first(function($item) use ($fixture) {
                    if(gettype($item) == "string") return null;
                    
                    return @$item["@static_id"] == $fixture->static_id;
                });
            }

            // $predictionsData = $predictionsData["@static_id"] == $fixture->static_id;
            // Log::info($predictionsData["@static_id"]);

            // $predictionsData = array_filter($predictionsData, fn($value) => ($value)["@static_id"] == $fixture->static_id);
            
            $data = ["stats" => $statsData, "prediction" => $predictionsData];

            return MatchOverviewTransformer::make($data)->toArray();

        } catch (RequestException $e) {
            Log::error($e);
            return response()->json(["message" => $e->getMessage(), "status" => false], $e->response->status());
        } catch (\Exception $e) {
            Log::error($e);
            return response()->json(["error" => $e->getMessage(), "status" => false], 500);
        }
    }
}
