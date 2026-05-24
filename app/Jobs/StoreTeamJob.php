<?php

namespace App\Jobs;

use App\Actions\StoreTeamAction;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class StoreTeamJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(private int $teamId)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        StoreTeamAction::handle($this->teamId);
    }
}
