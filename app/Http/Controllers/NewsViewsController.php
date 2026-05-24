<?php

namespace App\Http\Controllers;

use App\Models\NewsViews;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class NewsViewsController extends Controller
{
    public function __invoke(Request $request) {
        $record = NewsViews::firstOrCreate(["news_id" => $request->id, "client_ip" => $request->ip(), "date" => now()->format("Y-m-d")], [
            "news_id" => $request->id,
            "date" => now()->format("Y-m-d"),
            "client_ip" => $request->ip(),
            "user_agent" => $request->userAgent(),
            "count" => 1,
        ]);

        if(!$record->wasRecentlyCreated) {

            $record->increment('count');
        }

    }
}
