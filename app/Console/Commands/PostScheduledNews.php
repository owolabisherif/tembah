<?php

namespace App\Console\Commands;

use App\Models\News;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class PostScheduledNews extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'post-scheduled-news';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command to post scheduled news';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $timezone =  'Asia/Qatar';
        date_default_timezone_set($timezone);

        $news = News::whereNotNull('scheduled_for')->get();

        if(!$news->count()) {
            return;
        }

        foreach ($news as $item) {
            $post_time = strtotime($item->scheduled_for);

            if(time() >= $post_time) {
                $n = News::find($item->id);
                $n->status = 1;
                $n->scheduled_for = null;
                $n->save();
            }
        }
    }
}
