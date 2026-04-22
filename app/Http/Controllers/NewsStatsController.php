<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class NewsStatsController extends Controller
{
    public function index() {
        return Inertia::render("backend/news/stats", []);
    }
}
