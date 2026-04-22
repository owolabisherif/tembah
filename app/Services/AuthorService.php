<?php

namespace App\Services;

use App\Actions\DropImageAction;
use App\Jobs\OptimizeImageJob;
use App\Models\Image;
use App\Models\Author;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AuthorService
{
    /**
     * Create a new class instance.
     */
    public function store(Request $request)
    {
        try {
            DB::beginTransaction();

            $keywords = array();
            $imagePaths = array();

            $imagePath = 'uploads/images';

            $data = [
                "slug" => makeSlug(new Author(), $request->name),
                "slug_ar" => makeSlug(new Author(), $request->name_ar, "slug_ar"),
                "name" => $request->name,
                "name_ar" => $request->name_ar,
                "about" => $request->about,
                "about_ar" => $request->about_ar,
                "web_url" => $request->web_url,
                "facebook" => $request->facebook,
                "x" => $request->x,
                "instagram" => $request->instagram,
                "whatsapp" => $request->whatsapp,
                "status" => (bool) $request->status,
                "user_id" => Auth::id()
            ];

            $author = Author::updateOrCreate(["id" => $request->id], $data);

            if(count($request->images) > 0) {

                if ($request->isMethod("PUT")) DropImageAction::handle($author, Author::class, $imagePath);
    
    
                $path = $request->images[0]->store($imagePath, "public");
                $url = url("/") . "/storage" . "/$path";
                $imagePaths[] = $path;    
    
                $author->image()->updateOrCreate(["imageable_id" => $author->id],[
                    "url" => $url,
                ]);
            }

            if ($request->meta_title != "" && $request->meta_title_ar != "") {
                $author->seo()->updateOrCreate(["seoable_id" => $author->id], [
                    "meta_title" => $request->meta_title,
                    "meta_title_ar" => $request->meta_title_ar,
                    "meta_desc" => $request->meta_desc,
                    "meta_desc_ar" => $request->meta_desc_ar,
                    "keywords" => implode(", ", $keywords),
                    "keywords_ar" => implode(", ", $keywords),
                ]);
            }

            DB::commit();

            OptimizeImageJob::dispatch($imagePaths);

            return $author;
        } catch (QueryException $e) {
            DB::rollBack();
            
            Log::error($e);

            throw $e;
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error($e);

            throw $e;
        }
    }
}
