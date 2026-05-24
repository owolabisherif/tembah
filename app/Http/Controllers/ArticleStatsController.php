<?php

namespace App\Http\Controllers;

use App\Models\ArticleView;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ArticleStatsController extends Controller
{
    public function index()
    {
        return Inertia::render("backend/article/stats", []);
    }


    public function show()
    {
        try {
            return ArticleView::with(["article"])->latest('count')->paginate(3)->through(function ($row) {
                return [
                    "id" => $row->id,
                    "article" => $row->article,
                    "client_ip" => $row->client_ip,
                    "user_agent" => $row->user_agent,
                    "count" => $row->count,
                    "date" => $row->date,
                ];
            });
        } catch (\Exception $e) {
            return [];
        }
    }
}
