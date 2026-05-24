<?php

namespace App\Http\Controllers;

use App\Actions\DropImageAction;
use App\Models\Author;
use App\Services\AuthorService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuthorController extends Controller
{
    public function __construct(private AuthorService $service){}

    public function index()
    {

        return Inertia::render("backend/author/index", []);
    }


    public function store(Request $request)
    {
        try {
            $author = $this->service->store($request);

            return response()->json(["status" => true, "message" => "Author created successfully."]);
        } catch (\Exception $e) {

            return response()->json(["status" => false, "message" => $e->getMessage()], 500);
        }
    }

    public function show() {
        try {
            return Author::with(["image"])->paginate(10)->through(function ($q) {
                $q->imageUrl = @$q->image->name;

                return $q;
            });
        } catch (\Exception $e) {

            return response()->json(["status" => false, "message" => $e->getMessage()], 500);
        }
       
    }

    public function edit(Author $author) {
        $author->load(["seo", "image"]);

        return Inertia::render("backend/author/create", [
            "author" => $author
        ]);
    }
    
    public function create()
    {
        return Inertia::render("backend/author/create", []);
    }

    public function delete(Author $author) {
        try {
            DropImageAction::handle($author, Author::class, 'uploads/images');

            $author->delete();
        } catch (\Exception $e) {

            return response()->json(["status" => false, "message" => $e->getMessage()], 500);
        }
    }
}
