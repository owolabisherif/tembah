<?php

namespace App\Http\Controllers;

use App\Models\Newsletter;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NewsletterUnsubController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(string $email)
    {
        $message = "";
        $nl = Newsletter::where(["email" => $email, "status" => 1])->first();

        if($nl) {
            $nl->status = 0;
            $nl->save();
            $message = "You were unsubscribed successfuly.";
        } else {
            $message = "You previousely unsubcribed from this service/Email does not exist on our server.";
        }

        return Inertia::render('', [
            "message" => __($message),
        ]);
    }
}
