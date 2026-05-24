<?php

namespace App\Jobs;

use App\Actions\StorePlayerAction;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class StorePlayerJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(private int $playerId, private int $shirt)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        StorePlayerAction::handle($this->playerId, $this->shirt);
    }
}
