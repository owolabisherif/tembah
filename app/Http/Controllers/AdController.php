<?php

namespace App\Http\Controllers;

use App\Enums\AdType;
use App\Services\AdService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdController extends Controller
{
    public function __construct(private AdService $service)
    {
        //
    }

    public function index() {
        return Inertia::render("backend/ad/index", [
           
        ]);
    }

    public function store(Request $request) {
        try {
            $ad = $this->service->store($request);

            return response()->json(["status" => true, "message" => "Ad created successfully."]);
        } catch (\Exception $e) {

            return response()->json(["status" => false, "message" => $e->getMessage()], 500);
        }
    }

    public function create() {
        return Inertia::render("backend/ad/create", [
            "types" => collect(AdType::cases())->map(fn($q) => ["value" => $q->value, "text" => $q->value]),
        ]);
    }
}
