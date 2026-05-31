<?php

namespace App\Jobs;

use App\Models\Fixture;
use App\Models\HistoricalFixture;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class StoreHistoricalFixturesJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(private array $data, private string $date)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            $fixtures =  HistoricalFixture::where(['date' =>  $this->date])?->first() ?? new HistoricalFixture();
            $fixtures->date = $this->date;
            $fixtures->data = $this->data;
    
            $fixtures->save();
        } catch (\Exception $e) {
            Log::error($e);
        }
    }
}
