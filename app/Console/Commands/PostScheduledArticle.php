<?php

namespace App\Console\Commands;

use App\Models\Article;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class PostScheduledArticle extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'post-scheduled-article';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command to post scheduled article';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $timezone =  'Asia/Qatar';
        date_default_timezone_set($timezone);

        $articles = Article::whereNotNull('scheduled_for')->get();

        if(!$articles->count()) {
            return;
        }

        foreach ($articles as $item) {
            $post_time = strtotime($item->scheduled_for);

            if(time() >= $post_time) {
                $n = Article::find($item->id);
                $n->status = 1;
                $n->scheduled_for = null;
                $n->save();
            }
        }
    }
}
