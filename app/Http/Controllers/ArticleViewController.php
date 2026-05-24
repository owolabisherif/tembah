<?php

namespace App\Http\Controllers;

use App\Models\ArticleView;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ArticleViewController extends Controller
{
    public function __invoke(Request $request)
    {
        try {
            $record = ArticleView::firstOrCreate(["article_id" => $request->id, "client_ip" => $request->ip(), "date" => now()->format("Y-m-d")], [
                "article_id" => $request->id,
                "date" => now()->format("Y-m-d"),
                "client_ip" => $request->ip(),
                "user_agent" => $request->userAgent(),
                "count" => 1,
            ]);
    
            if (!$record->wasRecentlyCreated) {
    
                $record->increment('count');
            }
        } catch (\Exception $e) {
            Log::error($e);
        }
    }
}
