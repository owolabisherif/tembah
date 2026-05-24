<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PagesController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(string $slug)
    {
        try {
            $page = Page::with(["seo"])->whereSlug($slug)->firstOrFail();

            if($page) {
                return Inertia::render("custom-page", [
                    "slug" => $slug,
                    "pageData" => $page,
                    "seo" => $page->seo ?? null,
                ]);
            }

            abort(404);

        } catch (\Exception $e) {
            Log::error($e);
        }
    }
}
