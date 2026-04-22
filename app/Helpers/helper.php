<?php

use App\Models\Author;
use App\Models\Category;
use App\Models\League;
use App\Models\Player;
use App\Models\Tag;
use App\Models\Team;
use League\Fractal\Serializer\JsonApiSerializer;
use Spatie\Fractal\Facades\Fractal;
use League\Fractal\TransformerAbstract;
use Illuminate\Database\Eloquent\Model;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;
use ArPHP\I18N\Arabic;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

if (!function_exists("base64ToImage")) {
    function base64ToImage(string $base64str, string $storage_path): bool
    {
        $imageCode = explode(",", $base64str);
        $imageData = end($imageCode);

        $decodedImage = base64_decode($imageData);

        if ($decodedImage) {
            file_put_contents($storage_path, $decodedImage);

            return true;
        }

        return false;
    }
}

if (!function_exists("isArabic")) {
    function isArabic(string $str): bool
    {
        $arabic = new Arabic();

        return $arabic->isArabic($str);
    }
}

if (!function_exists("getUserLocation")) {
    function getUserLocation(): mixed
    {
        $userIP = @$_SERVER["REMOTE_ADDR"] ?? '127.0.0.1';
        
        $apiKey = env("GEO_LOCATION_APIKEY");

        $res = Cache::rememberForever("geolocation.$userIP", function() use($apiKey) {
            $url = App::environment("local") ? "https://api.ipgeolocation.io/v2/timezone?apiKey=$apiKey&ip=37.211.170.31" : "https://api.ipgeolocation.io/v2/timezone?apiKey=$apiKey";

            $curl = curl_init();
            curl_setopt_array($curl, array(
                CURLOPT_URL => $url,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'GET',
                CURLOPT_HTTPHEADER => array(
                    'Content-Type: application/json'
                )
            ));
            $response = curl_exec($curl);
            curl_close($curl);

            return json_decode($response);
        });

        // Log::info(json_encode($res));

        return $res;
    }
}


if (!function_exists("getPaginatedData")) {

    function getPaginatedData(LengthAwarePaginator $paginator, TransformerAbstract $model_transform): array
    {
        $collection = $paginator->getCollection();

        $data = Fractal::create()->collection($collection, $model_transform)
            ->serializeWith(new JsonApiSerializer())
            ->paginateWith(new IlluminatePaginatorAdapter($paginator))
            ->toArray();

        return $data;
    }
}

if (!function_exists("getSingleData")) {

    function getSingleData(Model $model, TransformerAbstract $model_transform,): array
    {
        $data = Fractal::create()->item($model)
            ->transformWith($model_transform)
            ->toArray();

        return $data;
    }
}



if (!function_exists("makeArabicSlug")) {

    function makeArabicSlug($string = null, $separator = "-")
    {
        if (is_null($string)) {
            return "";
        }

        $string = trim($string);

        // Lower case everything
        // using mb_strtolower() function is important for non-Latin UTF-8 string
        $string = mb_strtolower($string, "UTF-8");

        // Make alphanumeric (removes all other characters)
        // this makes the string safe especially when used as a part of a URL
        // this keeps latin characters and arabic charactrs as well
        $string = preg_replace("/[^\p{L}0-9_\s-]/u", "", $string);

        // Remove multiple dashes or whitespaces
        $string = preg_replace("/[\s-]+/", " ", $string);

        // Convert whitespaces and underscore to the given separator
        $string = preg_replace("/[\s_]/", $separator, $string);

        return $string;
    }
}

if (!function_exists("makeSlug")) {
    function makeSlug(Model $model, $str, $column = "slug")
    {
        if (!is_subclass_of($model, Model::class)) {
            throw new \InvalidArgumentException("Invalid model class provided.");
        }

        $arabic = new Arabic();

        $slug = $arabic->isArabic($str) ? makeArabicSlug($str) : Str::slug($str);

        $exists = $model::where(["$column" => $slug])->exists();

        if ($exists) {
            $next = $model::where("$column", "LIKE", '%' . $slug . '%')->count();

            return $slug . "-$next";
        } else {
            return $slug;
        }
    }
}
if(!function_exists('isCurrentSeason')) {
    function isCurrentSeason(string $season): bool {
        if($season == "") return true;
        
        $years = explode("-", $season);
        $curentYear = now()->year;

        if(empty($years)) return true;

        if(in_array($curentYear, $years)) {
            return true;
        }

        return false;
    }
}

if(!function_exists('blackListedCountries')) {
    function blackListedCountries(): Collection {
        return collect(["isreal", "israel", "isrel", "isreel"]);
    }
}

if(!function_exists('blackListedLeagues')) {
    function blackListedLeagues(): array {
        $countries =  [69];
        $leagues = array();

        $blackListedLeagues = League::whereIn('country_id', $countries)->get(["league_id"]);

        foreach ($blackListedLeagues as $value) {
            $leagues = [...$leagues, $value["league_id"]];
        }

        return $leagues;
    }
}

if(!function_exists('countries')) {
    function countries(): mixed {
        $countries = file_get_contents(realpath(public_path("assets/json/countries.json")));

        return $countries;
    }
}

if(!function_exists('getCountryFlag')) {
    function getCountryFlag($country): mixed {
        $json = file_get_contents(realpath(public_path("assets/json/countries_flag.json")));

        $fixes = [
            "usa" => "United States",
            "ivory coast" => "Côte d’Ivoire"
        ];

        $country = strtolower($country) == "usa" ? "United States" : $country;

        $c = collect(json_decode($json))->first(fn($item) => strtolower($item->country) == strtolower($country));

        
        if(!$c) {
            $c = collect(json_decode($json))->first(fn($item) => strtolower($item->country) == strtolower(@$fixes[trim(strtolower($country))]));
        }


        return @$c->flag;
    }
}

if (!function_exists('getCountriesInContinent')) {
    function getCountriesInContinent(): array
    {
        $continent = getUserLocation()?->location?->continent_name ?? "Asia";

        $countries = collect(json_decode(countries()))->filter(fn($country) => strtolower($country->continent) == strtolower($continent))
        ->map(fn($item) => strtolower($item->country))->values()->toArray();

        $countries = collect($countries)->filter(fn($item) => !in_array($item, blackListedCountries()->toArray()))->values()->toArray();

        return $countries;
    }
}

if(!function_exists("getArabic")) {
    function getArabic($string) {
        try {
            $arabic = new Arabic();

            return $arabic->en2ar($string);
        } catch (\Throwable $th) {
            return $string;
        }
    }
}

if(!function_exists("authors")) {
    function authors() {
        try {
            $authors = Author::all()->map(fn($author) => ["value" => str($author->id), "text" => $author->name . " (" . $author->name_ar . ")"]);

            return $authors;
        } catch (\Throwable $th) {
            return [];
        }
    }
}

if(!function_exists("tags")) {
    function tags() {
        try {
            $tags = Tag::all()->map(fn($tag) => ["value" => $tag->id, "text" => $tag->title." (".$tag->title_ar.")"]);

            return $tags;
        } catch (\Throwable $th) {
            return [];
        }
    }
}

if(!function_exists("categories")) {
    function categories() {
        try {
            $categories = Category::all()->map(fn($tag) => ["value" => $tag->id, "text" => $tag->title." (".$tag->title_ar.")"]);

            return $categories;
        } catch (\Throwable $th) {
            return [];
        }
    }
}

if(!function_exists("players")) {
    function players() {
        try {
            $players = Player::all()->map(fn($player) => ["value" => $player->id, 
            "player_id" => $player->player_id, "text" => $player->name." (".$player->name_ar.")"])->sortBy("text")->values();

            return $players;
        } catch (\Throwable $th) {
            return [];
        }
    }
}

if(!function_exists("leagues")) {
    function leagues() {
        try {
            $leagues = League::all()->filter(fn($league) => !in_array($league->league_id, blackListedLeagues()))
            ->map(fn($league) => ["value" => $league->id, "text" => $league->name." (".$league->name_ar.")"])->sortBy("text")->values();

            return $leagues;
        } catch (\Exception $e) {
            Log::error($e);
            return [];
        }
    }
}

if(!function_exists("teams")) {
    function teams() {
        try {
            $teams = Team::with(["country"])->get()
            ->filter(fn($team) => !in_array(@$team->country->name, blackListedCountries()->toArray()))
            ->filter(fn($team) => $team->name != null)
            ->map(fn($team) => ["value" => $team->id, "text" => $team->name." (".$team->name_ar.")"])->sortBy("text")->values();

            return $teams;
        } catch (\Exception $e) {
            return [];
        }
    }
}
