<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class TransferNewsStatController extends Controller
{
    public function index()
    {

        return Inertia::render("backend/news/transfer/stats", []);
    }
}
