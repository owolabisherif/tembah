<?php

namespace App\Actions;

use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Support\Facades\Log;

class GameCalenderGeneratorAction {
    public static function handle() {

        $negativeDates = collect(CarbonPeriod::create(Carbon::now()->subDays(7), Carbon::now()->subDay()))->sortDesc()->values();

        $positiveDates = collect(CarbonPeriod::create(Carbon::now()->addDay(), Carbon::now()->addDays(7)))
        ->map(fn(string $dt) => Carbon::parse($dt)->format("Y-m-d"))->values();

        $negativeDates = collect($negativeDates)->map(function(string $dt, int $index){
           $value = $index + 1; 
           return [
            "label" => Carbon::parse($dt)->isYesterday() ? "Yesterday" : Carbon::parse($dt)->format("Y-m-d"),
            "value" => "d-{$value}"
           ];
        })->sortBy("label")->values();
        
        $positiveDates = collect($positiveDates)->map(function(string $dt, int $index){
           $value = $index + 1; 
           return [
                "label" => Carbon::parse($dt)->isTomorrow() ? "Tomorrow" : Carbon::parse($dt)->format("Y-m-d"),
                "value" => "d{$value}"
           ];
        })->values();

        $dates = [...$negativeDates, ["label" => "Today", "value" => "home"], ...$positiveDates];


        return $dates;
    }
}