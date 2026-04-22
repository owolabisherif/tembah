<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class AdRequestController extends Controller
{
    public function index() {
        return Inertia::render("backend/ad/request", []);
    }
}
