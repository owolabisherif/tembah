<?php

namespace App\Http\Controllers;

use App\Enums\Status;
use App\Models\League;
use App\Transformers\LeaguesTransformer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class CountryController extends Controller
{
    public function index() {
        return Inertia::render("backend/country", []);
    }
}
