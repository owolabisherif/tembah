<?php

namespace App\Console\Commands;

use App\Events\RefreshGamesEvent;
use Illuminate\Console\Command;

class RefreshGamesCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:refresh-games';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Refresh football games';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        RefreshGamesEvent::dispatch();

        echo 'done';
    }
}
