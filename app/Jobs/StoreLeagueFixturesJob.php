<?php

namespace App\Jobs;

use App\Models\LeagueFixture;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class StoreLeagueFixturesJob implements ShouldQueue
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
        LeagueFixture::upsert([...$this->match], ["league_id", "date"], ["date", "league", "country"]);
    }
}
