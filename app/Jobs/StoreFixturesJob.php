<?php

namespace App\Jobs;

use App\Models\Fixture;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class StoreFixturesJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(private array $match)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Fixture::upsert([...$this->match], ["static_id"], ["fixture_id", "static_id", "slug", "league_id", "home_team_id", "away_team_id", "league", "country" ,"date", "match"]);
    }
}
