<?php

namespace App\Http\Controllers;

use App\Enums\AdType;
use App\Services\AdService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Ad;

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

    public static function show() {
        try {
            return Ad::with(["image"])->paginate(10)->through(function($q) {
                
                $q->imageUrl = @$q->image->name;

                return $q;
            });
        } catch (\Exception $e) {
            return response()->json([], 500);
        }
    }


    public function edit(Ad $ad) {
        try {

            $ad->load(["image", "seo"]);

            return Inertia::render("backend/ad/create", [
                "types" => collect(AdType::cases())->map(fn($q) => ["value" => $q->value, "text" => $q->value]),
                "ad" => $ad
            ]);
        } catch (\Exception $e) {
            return redirect()->back();
        }
    }

    public function store(Request $request) {
        try {
            $ad = $this->service->store($request);

            return response()->json(["status" => true, "message" => $request->isMethod('PUT')  ? "Ad updated successfully." : "Ad created successfully."]);
        } catch (\Exception $e) {

            return response()->json(["status" => false, "message" => $e->getMessage()], 500);
        }
    }

    public function create() {
        return Inertia::render("backend/ad/create", [
            "types" => collect(AdType::cases())->map(fn($q) => ["value" => $q->value, "text" => $q->value]),
        ]);
    }


    public function delete(Ad $ad) {
        try {
            $ad->delete();
        } catch (\Exception $e) {
            return response()->json([], 500);
        }
    }
}
