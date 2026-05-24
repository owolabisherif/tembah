<?php

namespace App\Http\Controllers;

use App\Models\NewsViews;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class NewsStatsController extends Controller
{
    public function index() {
        return Inertia::render("backend/news/stats", []);
    }


    public function show() {
        try {
            return NewsViews::with(["news"])->latest('count')->paginate(3)->through(function ($row) {
                return [
                    "id" => $row->id,
                    "news" => $row->news,
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
