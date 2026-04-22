<?php

namespace App\Http\Controllers;

use App\Services\AuthorService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuthorController extends Controller
{
    public function __construct(private AuthorService $service)
    {
        //
    }

    public function index()
    {

        return Inertia::render("backend/author/index", []);
    }


    public function store(Request $request)
    {
        try {
            $author = $this->service->store($request);

            return response()->json(["status" => true, "message" => "Author created successfully."]);
        } catch (\Exception $e) {

            return response()->json(["status" => false, "message" => $e->getMessage()], 500);
        }
    }

    public function create()
    {
        return Inertia::render("backend/author/create", []);
    }
}
