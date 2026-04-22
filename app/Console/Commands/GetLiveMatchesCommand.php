<?php

namespace App\Console\Commands;

use App\Actions\GetGamesAction;
use App\Services\Cacher;
use App\Transformers\GameTransformer;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use stdClass;

class GetLiveMatchesCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:get-live-matches';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command to get live matched';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        try {
            $games = GetGamesAction::make('live')->handle();

            if ($games instanceof stdClass) {
                $games = [$games];
            }

            $liveOutput = response()->json(GameTransformer::make($games)->get());

            $t = now();

            if(!empty($liveOutput)) {
                $date = Carbon::now()->format("Y-m-d");
                $key = "soccer-live-today-$date";
                
                Cacher::refresh($key, Carbon::now()->addSeconds(60), function () use ($games) {
                    return $games;
                });

                Log::info("Live Games refreshed {$t}");
            } else {
                Log::info("Live Games was not refreshed {$t}");
            }
        } catch (\Exception $e) {
           Log::error($e);
        }
    }
}
