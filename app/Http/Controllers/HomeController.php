<?php

namespace App\Http\Controllers;

use App\Models\Country;
use App\Transformers\LeaguesTransformer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        // header("Location: https://pguat.qcb.gov.qa/qcb-portal/login");
        // exit();
        return Inertia::render('welcome', []);
    }
}
