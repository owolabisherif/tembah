<?php

namespace App\Http\Controllers;

use App\Models\League;
use App\Transformers\LeaguesTranformer;
use ArPHP\I18N\Arabic;
use Illuminate\Http\Request;
use Inertia\Inertia;


class LeagueController extends Controller
{

    public function index()
    {
        return Inertia::render("backend/league", []);
    }
}
