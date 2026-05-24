<?php

namespace App\Http\Controllers;

use App\Actions\DropImageAction;
use App\Enums\Status;
use App\Jobs\OptimizeImageJob;
use App\Models\Country;
use App\Models\League;
use App\Services\Cacher;
use App\Transformers\AllLeaguesTransformer;
use App\Transformers\LeaguesTransformer;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Str;

class CountryController extends Controller
{
    public function index() {
        return Inertia::render("backend/country/index", []);
    }


    public function show() {
        try {
            return Country::with(["image"])->orderBy("sort", "ASC")->paginate(50)->through(function($q) {
                $q->imageUrl = @$q->image ? $q->image->name : getCountryFlag($q->name);

                return $q;
            });
        } catch (\Exception $e) {
            return response()->json([], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function store(Request $request) {
        try {
            DB::beginTransaction();

            $country = Country::find($request->id);

            $country->name = $request->name;
            $country->name_ar = $request->name_ar;
            $country->sort = $request->sort;
            $country->status = $request->status == 'true' ? true : false;

            $country->save();

            if ($request->meta_title != "" && $request->meta_title_ar != "") {
                $country->seo()->updateOrCreate(["seoable_id" => $country->id], [
                    "meta_title" => $request->meta_title,
                    "meta_title_ar" => $request->meta_title_ar,
                    "meta_desc" => $request->meta_desc,
                    "meta_desc_ar" => $request->meta_desc_ar,
                    "keywords" => $request->keywords,
                    "keywords_ar" => $request->keywords_ar,
                ]);
            }


            $imagePath = 'uploads/images';

            if ($request->isMethod("PUT")) DropImageAction::handle($country, Country::class, $imagePath);

            if ($request->images && count($request->images) > 0) {
                $path = $request->images[0]->store($imagePath, "public");
                $imagePaths[] = $path;
                $imageArray = explode("/", $path);
                $name = array_pop($imageArray);

                $country->image()->updateOrCreate(["imageable_id" => $country->id], [
                    "name" => $name,
                ]);

                OptimizeImageJob::dispatch($imagePaths);
            }

            Cacher::refreshRememberForever("all-leagues", function() {
                $userCountry = getUserLocation()?->location?->country_name ?? "Qatar";

                $leagues = Country::with(["image"])->whereStatus(Status::ACTIVE)->with(["leagues" => function ($q) {
                    $q->orderBy("name", "ASC");
                }])->orderBy("sort", "ASC")->orderBy("name", "ASC")->get()->transformWith(new AllLeaguesTransformer())->toArray()["data"];

                [$localeLeague, $otherLeagues] = Arr::partition($leagues, function ($country) use ($userCountry) {
                    return $country["name"] == Str::lower($userCountry);
                });

                return [...$localeLeague, ...$otherLeagues];
            });


            DB::commit();

            return response()->json(["status" => true, "message" => "Country created successfully."]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }


    public function update(Country $country) {
        $country->load(["seo"]);

        return Inertia::render("backend/country/country-form", [
            "country" => $country
        ]);
    }
}
