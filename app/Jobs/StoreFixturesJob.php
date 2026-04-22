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
        Fixture::upsert([...$this->match], ["static_id"], ["date","fixture_id", "league_id", "slug", "league", "country", "match"]);
    }
}
