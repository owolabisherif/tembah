<?php

namespace App\Console\Commands;

use App\Actions\GetGamesAction;
use App\Models\HistoricalFixture;
use App\Services\Cacher;
use App\Transformers\GameTransformer;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use stdClass;

class RefreshTodayGameCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:refresh-game';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Refresh today games';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        try {
            $now = Carbon::now()->format("Y-m-d");
            $t = now();
    
            $games = GetGamesAction::make('home')->handle();

            if(empty($games)) {
                Log::info("An error occured: $t");
                return;
            }

            if ($games instanceof stdClass) {
                $games = [$games];
            }

            $games = GameTransformer::make($games)->get();

            $fixtures =  HistoricalFixture::where(['date' => $now])?->first() ?? new HistoricalFixture();
            $fixtures->date = $now ;
            $fixtures->data = $games;

            $fixtures->save();

            Log::info("Game refreshed {$t}");

        } catch (\Exception $e) {
            Log::info("Game refresh error");
            Log::error($e);
        }
    }
}
