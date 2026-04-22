<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class HelperProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $helpers = glob(app_path('Helpers') . '/*.php');

        foreach ($helpers as $helper) {
            require_once $helper;
        }
    }
}
