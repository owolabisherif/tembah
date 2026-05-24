<?php

namespace App\Providers;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Blade::directive("schema", function ($expression) {
            return getSchema($expression);
        });
        
        Blade::directive("seo", function ($expression) {

            return "<?php echo getSeo($expression) ?>";
        });
    }
}
