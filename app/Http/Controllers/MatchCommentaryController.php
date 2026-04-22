<?php

namespace App\Http\Controllers;

use App\Models\Fixture;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
class MatchCommentaryController extends Controller
{
    private $key;
    private $endPoint;

    public function  __construct()
    {
        $this->key =  env("GOAL_SERVE_KEY");
        $this->endPoint = env("GOAL_SERVE_ENDPOINT");
    }
    /**
     * Handle the incoming request.
     */
    public function __invoke($slug)
    {
        try {
            $fixture = Fixture::whereSlug($slug)->first();

            if (!$fixture) return [];


            $response = Http::get("{$this->endPoint}/{$this->key}/commentaries/{$fixture->league_id}_predicted.xml?json=1")->throw();
            // $response = Http::get("{$this->endPoint}/{$this->key}/soccerfixtures/{$fixture->league_id}/{$fixture->static_id}?json=1")->throw();
            // $response = Http::get("{$this->endPoint}/{$this->key}/commentaries/match?id={$fixture->static_id}&league={$fixture->league_id}&json=1")->throw();
            // $response = Http::get("{$this->endPoint}/{$this->key}/soccerleague/{$fixture->league_id}?json=1")->throw();

            return $response->collect();

            return response()->json($response);
        } catch (RequestException $e) {
            return response()->json(["message" => $e->getMessage(), "status" => false], $e->response->status());
        } catch (\Exception $e) {
            return response()->json(["error" => $e->getMessage(), "status" => false], 500);
        }
    }
}
