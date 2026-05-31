<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');


Schedule::command("app:refresh-game")->cron("* * * * *")->withoutOverlapping();
Schedule::command("post-scheduled-news")->cron("* * * * *")->withoutOverlapping();
Schedule::command("post-scheduled-article")->cron("* * * * *")->withoutOverlapping();
// Schedule::command("app:get-live-matches")->everyThirtySeconds()->withoutOverlapping();