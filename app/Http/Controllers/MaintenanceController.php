<?php

namespace App\Http\Controllers;

use App\Jobs\SitemapJob;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class MaintenanceController extends Controller
{
    public function edit() {
        return Inertia::render('settings/maintenance');
    }


    public function update(Request $request) {
        try {
            $cache = boolval($request->cache);
            $optimize = boolval($request->optimize);
            $sitemap = boolval($request->optimize);

            if($cache) {
                Cache::clear();
            } 


            if($request->queue == 'clear') {
                Artisan::call(' queue:flush ');
            }

            if($request->queue == 'retry') {
                Artisan::call(' queue:retry ');
            }

            if($optimize) {
                Artisan::call('optimize');
            } else {
                Artisan::call('optimize:clear');
            }

            if ($sitemap) {
                SitemapJob::dispatch();
            }

        } catch (\Exception $e) {
            Log::error($e);
        }
    }
}
