<?php

namespace App\Http\Controllers;

use App\Models\Newsletter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Psy\Readline\Hoa\Console;

class NewsletterController extends Controller
{
    public function index() {
        return Inertia::render('backend/newsletter/index', []);
    }

    public function show() {
        try {
            return response()->json(Newsletter::paginate(50));
        } catch (\Exception $e) {
            Log::error($e);
            response()->json(["message" => $e->getMessage()], 500);
        }
    }

    public function create() {
        return Inertia::render('backend/newsletter/create', []);
    }


    public function store(Request $request) {
        try {
        //    Log::info($request->all());
        } catch (\Exception $e) {
            response()->json(["message" => $e->getMessage()], 500);
        }
    }

    public function delete(Newsletter $newsletter)
    {
        try {
            $newsletter->delete();
        } catch (\Exception $e) {
            response()->json(["message" => $e->getMessage()], 500);
        }
    }
}
