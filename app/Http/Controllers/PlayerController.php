<?php

namespace App\Http\Controllers;

use App\Actions\GetUpdatedPlayerAction;
use App\Jobs\OptimizeImageJob;
use App\Jobs\SitemapJob;
use App\Models\Player;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class PlayerController extends Controller
{
    public function index() {
        return Inertia::render("backend/player/index", []);
    }


    public function show()
    {
        try {
            return Player::orderBy("name", "ASC")->paginate(50)->through(function($q) {
                $q->nationality_flag = getCountryFlag($q->nationality);
                $q->birth_country_flag = getCountryFlag($q->birth_country);

                return $q;
            });

        } catch (\Exception $e) {
            return response()->json([], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function store(Request $request)
    {
        try {

            DB::beginTransaction();

            $by_pass = $request->by_pass == 'true' ? true : false;

            if ($by_pass) {
                $playerData = null;
            } else {
                $playerData = GetUpdatedPlayerAction::handle($request->player_id, $request->shirt);
            }

            $player = Player::updateOrCreate(["id" => $request->id], [
                "player_id" => $request->player_id,
                "team_id" => $playerData ? $playerData["team_id"] : $request->team_id,
                "national_team_id" => $playerData ? $playerData["national_team_id"] : $request->national_team_id,
                "slug" => $playerData ? $playerData['slug'] : makeSlug(new Player(), $request->name),
                "slug_ar" => $playerData ? $playerData['slug_ar'] : makeSlug(new Player(), getArabic($request->name), 'slug_ar'),
                "name" => $playerData ? $playerData['name'] : $request->name,
                "name_ar" => $playerData ? $playerData['name_ar'] : getArabic($request->name),
                "common_name" => $playerData ? $playerData['common_name'] : $request->common_name,
                "common_name_ar" => $playerData ? $playerData['common_name_ar'] : getArabic($request->common_name),
                "fullname" =>  $playerData ? $playerData['fullname'] : $request->fullname,
                "fullname_ar" => $playerData ? $playerData['fullname_ar'] : getArabic($request->fullname),
                "firstname" => $playerData ? $playerData['firstname'] : $request->firstname,
                "firstname_ar" => $playerData ? $playerData['firstname_ar'] : getArabic($request->firstname),
                "lastname" => $playerData ? $playerData['lastname'] : $request->lastname,
                "lastname_ar" => $playerData ? $playerData['lastname_ar'] : getArabic($request->lastname),
                "nationality" => $playerData ? $playerData['nationality'] : $request->nationality,
                "nationality_ar" => $playerData ? $playerData['nationality_ar'] : getArabic($request->nationality),
                "birth_country" => $playerData ? $playerData['birth_country'] : $request->birth_country,
                "birth_country_ar" => $playerData ? $playerData['birth_country_ar'] : getArabic($request->birth_country),
                "birth_place" => $playerData ? $playerData['birth_place'] : $request->birth_place,
                "birth_place_ar" => $playerData ? $playerData['birth_place'] : getArabic($request->birth_place),
                "birthdate" => $playerData ? $playerData['birthdate'] : $request->birthdate,
                "birthdate_ar" => $playerData ? $playerData['birthdate_ar'] : getArabic($request->birthdate),
                "position" => $playerData ? $playerData['position'] : $request->position,
                "position_ar" => $playerData ? $playerData['position_ar'] : getArabic($request->position),
                "age" => $playerData ? $playerData['age'] : $request->age,
                "age_ar" => $playerData ? $playerData['age_ar'] : getArabic($request->age),
                "height" => $playerData ? $playerData['height'] : $request->height,
                "height_ar" => $playerData ? $playerData['height_ar'] : getArabic($request->height),
                "shirt" => $playerData ? $playerData['shirt'] : $request->shirt,
                "shirt_ar" => $playerData ? $playerData['shirt_ar'] : getArabic($request->shirt),
                "preferred_foot" => $playerData ? $playerData['preferred_foot'] : $request->preferred_foot,
                "preferred_foot_ar" => $playerData ? $playerData['preferred_foot_ar'] : getArabic($request->preferred_foot),
                "market_value" => $playerData ? $playerData['market_value'] : $request->market_value,
                "weight" => $playerData ? $playerData['weight'] : $request->weight,
                "weight_ar" => $playerData ? $playerData['weight_ar'] : getArabic($request->weight),
                "image" => $playerData ? $playerData['image'] : "{$request->player_id}.png",
                "team" =>  $playerData["team"],
                "team_flag" =>  $playerData["team_flag"],
                "team_ar" => $playerData["team_ar"],
                "statistic" => $playerData ? $playerData['statistic'] : $request->statistic,
                "statistic_cups" => $playerData ? $playerData['statistic_cups'] : $request->statistic_cups,
                "statistic_cups_intl" => $playerData ? $playerData['statistic_cups_intl'] : $request->statistic_cups_intl,
                "transfers" => $playerData ? $playerData['transfers'] : $request->transfers,
                "trophies" => $playerData ? $playerData['trophies'] : $request->trophies,
                "overall_clubs" => $playerData ? $playerData['overall_clubs'] : $request->overall_clubs,
                "reload" => $playerData ? $playerData['reload'] : 0
            ]);

            if ($request->meta_title != "" && $request->meta_title_ar != "") {
                $player->seo()->updateOrCreate(["seoable_id" => $player->id], [
                    "meta_title" => $request->meta_title,
                    "meta_title_ar" => $request->meta_title_ar,
                    "meta_desc" => $request->meta_desc,
                    "meta_desc_ar" => $request->meta_desc_ar,
                    "keywords" => $request->keywords,
                    "keywords_ar" => $request->keywords_ar,
                ]);
            }


            if ($by_pass) {
                if ($request->hasFile('image')) {
                    $imagePath = "app/public/uploads/images/players/{$request->player_id}.png";
                    $file = $request->file('image')->getContent();

                    base64ToImage(base64_encode($file), storage_path($imagePath));

                    OptimizeImageJob::dispatch(["uploads/images/players/{$request->player_id}.png"]);
                }
            }

            DB::afterCommit(function() {
                SitemapJob::dispatch();
            });

            DB::commit();


            return response()->json(["status" => true, "message" => "Player updated successfully."]);
        } catch (\Exception $e) {
            Log::error($e);
            DB::rollBack();
            return response()->json(["status" => true, "message" => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }


    public function update(Player $player)
    {
        $player->load(["seo"]);

        return Inertia::render("backend/player/player-form", [
            "player" => $player
        ]);
    }
}
