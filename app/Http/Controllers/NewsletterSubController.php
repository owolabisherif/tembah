<?php

namespace App\Http\Controllers;

use App\Models\Newsletter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class NewsletterSubController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        try {
            $exist = Newsletter::where(["email" => $request->email, "status" => 1])->exists();

            if($exist) return redirect()->back()->withErrors(["message" => __("You are already subcribed, thank you.")]);
        
            Newsletter::updateOrCreate(["email" => $request->email], [
                "email" => $request->email,
                "status" => 1
            ]);

            return redirect()->back()->with(["message" => __("Thank you for subscribing.")]);

        } catch (\Exception $e) {
            return redirect()->back()->withErrors(["message" => __("An error occured, please try again.")]);
        }
    }
}
