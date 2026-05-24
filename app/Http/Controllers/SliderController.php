<?php

namespace App\Http\Controllers;

use App\Models\Slider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class SliderController extends Controller
{
    public function index() {
        
        return Inertia::render("backend/slider", []);
    }


    public function show() {
        try {
            return Slider::paginate(10)->through(function($q) {
                $q->image = $q->name;

                return $q;
            });
        } catch (\Exception $e) {
            return response()->json([], 500);
        }
    }


    public function delete(Slider $slider) {
        try {
            $slider->delete();
            Cache::forget("home-slider");
        } catch (\Exception $e) {
            return response()->json([], 500);
        }
    }
}
