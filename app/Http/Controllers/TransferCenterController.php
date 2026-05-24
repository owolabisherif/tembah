<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class TransferCenterController extends Controller
{
    public function index() {
        return Inertia::render("transfer-center", []);
    }
}
