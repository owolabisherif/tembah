<?php

use App\Jobs\StorePlayerJob;
use App\Models\Article;
use App\Models\Author;
use App\Models\Category;
use App\Models\Country;
use App\Models\Fixture;
use App\Models\League;
use App\Models\News;
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
use Spatie\Sitemap\Tags\Url;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Video;
use Carbon\Carbon;

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
        
        $apiKey = config('api.geo');

        $res = Cache::rememberForever("geolocation.$userIP", function() use($apiKey, $userIP) {
            $url = App::environment("local") ? "https://api.ipgeolocation.io/v2/timezone?apiKey=$apiKey&ip=37.211.170.31" : "https://api.ipgeolocation.io/v2/timezone?apiKey=$apiKey&ip=$userIP";

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
    function getCountryFlag(string $country): mixed {
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
    function getArabic(string | null $string) {
        try {

            if(!$string) return "";
            
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
            $leagues = League::with(["country"])->get()->filter(fn($league) => !in_array($league->league_id, blackListedLeagues()))
            ->map(fn($league) => ["value" => $league->id, "text" => ucfirst(@$league->country->name).'-'.$league->name." (".$league->name_ar.")"])->sortBy("text")->values();

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

if(!function_exists("countriesInDb")) {
    function countriesInDb() {
        try {
            $countries = Country::all()
            ->filter(fn($country) => !in_array($country->name, blackListedCountries()->toArray()))
            ->map(fn($country) => ["value" => $country->id, "text" => ucfirst($country->name)." (".$country->name_ar.")"])->sortBy("text")->values();

            return $countries;
        } catch (\Exception $e) {
            return [];
        }
    }
}



if (!function_exists("updateSitemap")) {

    function updateSitemap()
    {
        try {
            $news = News::with(["image", "seo"])->whereType("video")->get();
    
            $sitemap = Sitemap::create();
            $sitemap->add(
                Url::create(route('home'))
                    ->setLastModificationDate(Carbon::now())
                    ->setChangeFrequency(Url::CHANGE_FREQUENCY_YEARLY)
                    ->setPriority(0.1)
            )
                ->add(
                    Url::create(route('pages', ["slug" => 'about-us']))
                        ->setLastModificationDate(Carbon::now())
                        ->setChangeFrequency(Url::CHANGE_FREQUENCY_YEARLY)
                        ->setPriority(0.2)
                )
                ->add(
                    Url::create(route('pages', ["slug" => 'about-us']))
                        ->setLastModificationDate(Carbon::now())
                        ->setChangeFrequency(Url::CHANGE_FREQUENCY_YEARLY)
                        ->setPriority(0.2)
                )
                ->add(
                    Url::create(route('pages', ["slug" => 'about-us', "lang" => "en"]))
                        ->setLastModificationDate(Carbon::now())
                        ->setChangeFrequency(Url::CHANGE_FREQUENCY_YEARLY)
                        ->setPriority(0.2)
                )
                ->add(
                    Url::create(route('pages', ["slug" => 'about-us', "lang" => "ar"]))
                        ->setLastModificationDate(Carbon::now())
                        ->setChangeFrequency(Url::CHANGE_FREQUENCY_YEARLY)
                        ->setPriority(0.2)
                )
                ->add(
                    Url::create(route('pages', ["slug" => 'terms-of-use']))
                        ->setLastModificationDate(Carbon::now())
                        ->setChangeFrequency(Url::CHANGE_FREQUENCY_YEARLY)
                        ->setPriority(0.2)
                )
                ->add(
                    Url::create(route('pages', ["slug" => 'terms-of-use', "lang" => "en"]))
                        ->setLastModificationDate(Carbon::now())
                        ->setChangeFrequency(Url::CHANGE_FREQUENCY_YEARLY)
                        ->setPriority(0.2)
                )
                ->add(
                    Url::create(route('pages', ["slug" => 'terms-of-use', "lang" => "ar"]))
                        ->setLastModificationDate(Carbon::now())
                        ->setChangeFrequency(Url::CHANGE_FREQUENCY_YEARLY)
                        ->setPriority(0.2)
                )
                ->add(
                    Url::create(route('pages', ["slug" => 'advertise']))
                        ->setLastModificationDate(Carbon::now())
                        ->setChangeFrequency(Url::CHANGE_FREQUENCY_YEARLY)
                        ->setPriority(0.2)
                )
                ->add(
                    Url::create(route('pages', ["slug" => 'advertise', "lang" => "en"]))
                        ->setLastModificationDate(Carbon::now())
                        ->setChangeFrequency(Url::CHANGE_FREQUENCY_YEARLY)
                        ->setPriority(0.2)
                )
                ->add(
                    Url::create(route('pages', ["slug" => 'advertise', "lang" => "ar"]))
                        ->setLastModificationDate(Carbon::now())
                        ->setChangeFrequency(Url::CHANGE_FREQUENCY_YEARLY)
                        ->setPriority(0.2)
                )
                ->add(
                    Url::create(route('pages', ["slug" => 'cookie']))
                        ->setLastModificationDate(Carbon::now())
                        ->setChangeFrequency(Url::CHANGE_FREQUENCY_YEARLY)
                        ->setPriority(0.2)
                )
                ->add(
                    Url::create(route('pages', ["slug" => 'cookie', "lang" => "en"]))
                        ->setLastModificationDate(Carbon::now())
                        ->setChangeFrequency(Url::CHANGE_FREQUENCY_YEARLY)
                        ->setPriority(0.2)
                )
                ->add(
                    Url::create(route('pages', ["slug" => 'cookie', "lang" => "ar"]))
                        ->setLastModificationDate(Carbon::now())
                        ->setChangeFrequency(Url::CHANGE_FREQUENCY_YEARLY)
                        ->setPriority(0.2)
                )
                ->add(
                    Url::create(route('pages', ["slug" => 'privacy-policy']))
                        ->setLastModificationDate(Carbon::now())
                        ->setChangeFrequency(Url::CHANGE_FREQUENCY_YEARLY)
                        ->setPriority(0.2)
                )
                ->add(
                    Url::create(route('pages', ["slug" => 'privacy-policy', "lang" => "en"]))
                        ->setLastModificationDate(Carbon::now())
                        ->setChangeFrequency(Url::CHANGE_FREQUENCY_YEARLY)
                        ->setPriority(0.2)
                )
                ->add(
                    Url::create(route('pages', ["slug" => 'privacy-policy', "lang" => "ar"]))
                        ->setLastModificationDate(Carbon::now())
                        ->setChangeFrequency(Url::CHANGE_FREQUENCY_YEARLY)
                        ->setPriority(0.2)
                )
                ->add(
                    Url::create(route('text.news.index'))
                        ->setLastModificationDate(Carbon::now())
                        ->setChangeFrequency(Url::CHANGE_FREQUENCY_YEARLY)
                        ->setPriority(0.2)
                )
                ->add(
                    Url::create(route('transfer.news.index'))
                        ->setLastModificationDate(Carbon::now())
                        ->setChangeFrequency(Url::CHANGE_FREQUENCY_YEARLY)
                        ->setPriority(0.2)
                )
                ->add(
                    Url::create(route('category.news.index', [ "slug" => 'video-news' ]))
                        ->setLastModificationDate(Carbon::now())
                        ->setChangeFrequency(Url::CHANGE_FREQUENCY_YEARLY)
                        ->setPriority(0.2)
                )
                ->add(
                    Url::create(route('live.scores'))
                        ->setLastModificationDate(Carbon::now())
                        ->setChangeFrequency(Url::CHANGE_FREQUENCY_YEARLY)
                        ->setPriority(0.2)
                )
                ->add(
                    Url::create(route("tag.news"))
                        ->setLastModificationDate(Carbon::now())
                        ->setChangeFrequency(Url::CHANGE_FREQUENCY_YEARLY)
                        ->setPriority(0.2)
                )
                ->add(
                    Url::create(route("trending.news.index"))
                        ->setLastModificationDate(Carbon::now())
                        ->setChangeFrequency(Url::CHANGE_FREQUENCY_YEARLY)
                        ->setPriority(0.2)
                )
                ->add(
                    Url::create(route("article.news.index"))
                        ->setLastModificationDate(Carbon::now())
                        ->setChangeFrequency(Url::CHANGE_FREQUENCY_YEARLY)
                        ->setPriority(0.2)
                )
                ->add(
                    Url::create(route("article.news.index"))
                        ->setLastModificationDate(Carbon::now())
                        ->setChangeFrequency(Url::CHANGE_FREQUENCY_YEARLY)
                        ->setPriority(0.2)
                )
                ->add(News::all())
                ->add(Article::all())
                ->add(League::all())
                ->add(Player::all())
                ->add(Fixture::all());
            // $allowOptions = ['platform' => Video::OPTION_PLATFORM_MOBILE];
            // $denyOptions = ['restriction' => ''];
            if ($news->count()) {
                $options = ['family_friendly' => Video::OPTION_YES, 'requires_subscription' => Video::OPTION_NO, 'rating' => 4.8];
                foreach ($news as $new) {
                    $slug = $new->slug;
                    $videoUrl = $new->video_url;
                    $thumbnail = $new->image->name;
                    $page =  route('show.news.cat-tag', [ "type" => "video-news", "slug" => $slug, "page" => "categories" ]);

                    $desc = @$new->seo ? $new->seo->meta_desc : $new->body;
    
                    $sitemap->add(
                        Url::create($page)
                            ->addVideo($thumbnail, $new->title, $desc, $videoUrl, $page, $options)
                    );
                }
            }
            $sitemap->writeToFile(public_path("sitemap.xml"));
        } catch (\Exception $e) {
            Log::error($e);
        }
    }
}


if(!function_exists('getSchema')) {
    function getSchema(object | null $seo) {
        header('Content-Type: application/schema+json');

        $locale = App::getLocale() ?? 'en';
        $title = $seo && @$seo->meta_title && @$seo->meta_title_ar ? ($locale == 'en' ? $seo->meta_title : $seo->meta_title_ar) : "Tembah";
        $desc = $seo && @$seo->meta_desc && @$seo->meta_desc_ar ? ($locale == 'en' ? $seo->meta_desc : $seo->meta_desc_ar) : "An in-depth coverage of local & global Football News offering live reports on the latest Champions League ,Premier League ,Europe League and live score around world";
        $keywords = $seo && @$seo->keywords && @$seo->keywords_ar ? ($locale == 'en' ? $seo->keywords : $seo->keywords_ar) : "International football, matches, Champions League, World Cup qualifiers, Champions League qualifiers, international teams, the richest player in the world, the best player in the world, the best team in the world, global fans";
        $site = url("/");
        $logo = "$site/assets/images/logo2.png";
        $image = $seo && @$seo->image ? $seo->image : $logo;
        $country = $seo && @$seo->country ? $seo->country : "";
        $url = $seo && @$seo->url ? $seo->url : $site;
        $author = $seo && @$seo->author ? $seo->author : json_decode(json_encode(["name" => "Tembah"]));
        $members = $seo && @$seo->members ? $seo->members : [];
        $athletes = $seo && @$seo->athletes ? $seo->athletes : [];
        $coach = $seo && @$seo->coach ? $seo->coach : [];
        $nationality = $seo && @$seo->nationality ? $seo->nationality : [];
        $birth_place = $seo && @$seo->birth_place ? $seo->birth_place : [];
        $birth_date = $seo && @$seo->birth_date ? $seo->birth_date : "";
        $weight = $seo && @$seo->weight ? $seo->weight : "";
        $height = $seo && @$seo->height ? $seo->height : "";
        $net_worth = $seo && @$seo->net_worth ? $seo->net_worth : "";
        $name = $seo && @$seo->name && @$seo->name_ar ? ($locale == 'en' ? $seo->name : $seo->name_ar) : $title;

        $breadcrumb = $seo && @$seo->breadcrumb ? $seo->breadcrumb : [
            "@type" => "ListItem",
            "position" => 1,
            "name" => "Tembah | Welcome",
            "item" => "https://tembah.net/"
        ];
        $date = $seo && @$seo->date ? $seo->date : Carbon::now()->format("Y-m-d, H:m:s");
        $published = $seo && @$seo->published ? $seo->published : Carbon::now()->format("Y-m-d H:m:s");
        $modified = $seo && @$seo->modified ? $seo->modified : Carbon::now()->format("Y-m-d H:m:s");

        $types = [
            "website" => "Website",
            "webpage" => "WebPage",
            "article" => "Article",
            "news" => "NewsArticle",
            "organization" => "Organization",
            "sport-event" => "BroadcastEvent",
            "person" => "ProfilePage",
            "league" => "SportsOrganization",
            "team" => "SportsTeam",
        ];

        $type = $seo && @$seo->type ? $types[$seo->type] : "website";

        $schema = [];
        
        $schema["@context"] = "https://schema.org/";
        $schema["@type"] = $type;
        $schema["name"] = $title;
        $schema["description"] = $desc;
        $schema["url"] = $url;
        $schema["keywords"] = $keywords;
        $schema["publisher"] = [
            "@type" => "Organization",
            "name" => "Tembah",
            "logo" => $logo,
            "telephone" => "",
            "email" => "info@tembah.net",
            "address" => [
                "@type" => "PostalAddress",
                "addressLocality" => "Doha, Qatar",
                "postalCode" => "00000",
                "streetAddress" => "Building No. 147, Zone. 40, Street 340, Salwa Rd, Doha, Qatar",
            ],
        ];
        $schema["maintainer"] = [
            "@type" => "Organization",
            "name" => "Echo Media",
            "telephone" => "(+974) 44502111",
            "email" => "info@emqatar.com",
            "address" => [
                "@type" => "PostalAddress",
                "addressLocality" => "Doha, Qatar",
                "postalCode" => "00000",
                "streetAddress" => "Building No. 147, Zone. 40, Street 340, Salwa Rd, Doha, Qatar",
            ]
        ];

        $schema["breadcrumb"] = [
            "@context" => "https://schema.org",
            "@type" => "BreadcrumbList",
            "itemListElement" => $breadcrumb
        ];

        if($type == 'NewsArticle' || $type == 'Article') {
            $schema["headline"] = $title;
            $schema["mainEntityOfPage"] = $url;
            $schema["articleBody"] = $desc;
            $schema["datePublished"] = $published;
            $schema["dateModified"] = $modified;
            $schema["image"] = [$image];
            $schema["author"] = [
                "@type" => @$seo->author ? "Person" : 'Organization',
                "name" => $author->name,
            ];
        }

        if($type == 'SportsOrganization') {
            $schema['sport'] = 'Football';
            $schema['location'] = [
                '@type' => 'Country',
                'name' => ucfirst($country),
            ];
            $schema["members"] = $members;
            $schema["logo"] = $image;
        }

        if($type == 'SportsTeam') {
            $schema['sport'] = ucfirst($country).' Football';
            $schema["memberOf"] = $members;
            $schema["athlete"] = $athletes;
            $schema["coach"] = $coach;
            $schema["logo"] = $image;
        }

        if($type == 'ProfilePage') {
            $awards = $seo && @$seo->awards ? $seo->awards : [];
            $identifier = $seo && @$seo->identifier ? $seo->identifier : "";
            $schema["dateCreated"] = $published;
            $schema["dateModified"] = $modified;
            $schema["mainEntity"] = [
                "@type" => "Person",
                "name" => $name,
                "identifier" => $identifier,
                "image" => [
                    "@context" => "https://schema.org/",
                    "@type" => "ImageObject",
                    "countentUrl" => $image,
                    "license" => "https://tembah.net",
                    "creditText" => "Tembah",
                    "creator" => [
                        "@type" => "Organization",
                        "name" => "Tembah",
                    ],
                    "copyrightNotice" => "Tembah.net"
                ],
                'birth_place' => $birth_place,
                "memberOf" => $members,
                "affiliation" => $members,
                "works_for" => $members,
                "nationality" => [
                    '@type' => 'Country',
                    'name' => ucfirst($nationality),
                ],
                "awards" => $awards,
                "birth_date" => $birth_date,
                "weight" => $weight,
                "height" => $height,
                "net_worth" => $net_worth,
                "job_title" => "Footballer",
            ];
        }


        if($type == 'BroadcastEvent') {
            $homeTeam = $seo && @$seo->homeTeam ? $seo->homeTeam : [];
            $awayTeam = $seo && @$seo->awayTeam ? $seo->awayTeam : [];
            $location = $seo && @$seo->location ? $seo->location : "";
            $status = $seo && @$seo->status ? $seo->status : "";
            $organizer = $seo && @$seo->organizer ? $seo->organizer : "";
            //eventStatus": "https://schema.org/EventCancelled""

            $statuses = [
                "not started" => "EventScheduled",
                "ht" => "EventScheduled",
                "int." => "EventScheduled", 
                "ft" => "EventCompleted",
                "aet" => "EventCompleted",
                "delayed" => "EventCompleted",
                "pen." => "EventCompleted",
                "wo" => "EventCompleted",
                "awarded" => "EventCompleted",
                "postp." => "EventPostponed",
                "aban." => "EventCancelled",
                "cancl." => "EventCancelled",
                "susp." => "EventCancelled",
            ];

            

            $schema["isLiveBroadcast"] = Carbon::parse($date)->isValid() ? Carbon::parse($date)->isCurrentDay() : false;
            $schema["startDate"] = $date;
            $schema["image"] = $image;
            $schema["endDate"] = $date;
            $schema['sport'] = 'Football';
            $schema['status'] = @$statuses[$status] ? "https://schema.org/".$statuses[$status] : "https://schema.org/EventScheduled";
            $schema['about'] = $desc;
            $schema["homeTeam"] = $homeTeam;
            $schema["organizer"] = $organizer;
            $schema["awayTeam"] = $awayTeam;
            $schema["keywords"] = $keywords;
            $schema["broadcastOfEvent"] = [
                "@type" => "SportsEvent",
                "name" => $name,
                "competitor" => [$homeTeam, $awayTeam],
                "startDate" => $date,
                "location" => [
                    "@type" => "City",
                    "name" => $location
                ]
            ];
        }

        return $schema;
    }
}


if(!function_exists('getSeo')) {
    function getSeo(array $expression) {
        $page = json_decode(json_encode($expression));

        $seo = @$page->props->seo;
        
        $locale = App::getLocale() ?? 'en';

        $title = $seo && @$seo->meta_title && @$seo->meta_title_ar ? ($locale == 'en' ? $seo->meta_title : $seo->meta_title_ar) : "Tembah";
        $desc = $seo && @$seo->meta_desc && @$seo->meta_desc_ar ? ($locale == 'en' ? $seo->meta_desc : $seo->meta_desc_ar) : "An in-depth coverage of local & global Football News offering live reports on the latest Champions League ,Premier League ,Europe League and live score around world";
        $keywords = $seo && @$seo->keywords && @$seo->keywords_ar ? ($locale == 'en' ? $seo->keywords : $seo->keywords_ar) : "International football, matches, Champions League, World Cup qualifiers, Champions League qualifiers, international teams, the richest player in the world, the best player in the world, the best team in the world, global fans";
        $site = url("/");
        $image = $seo && @$seo->image ? $seo->image : "$site/assets/images/logo2.png";
        $url = $seo && @$seo->url ? $seo->url : $site;
        $author = $seo && @$seo->author ? $seo->author : json_decode(json_encode(["name" => "Tembah"]));
        $type = $seo && @$seo->type ? $seo->type : "website";
        

        $html = "";
        
        $html.= "<title>$title</title>";

        $html.="<link rel='alternate' type='application/rss+xml' title='Tembah » Feed' href='$site/feed'>";
        $html.="<link rel='alternate' type='application/atom+xml' title='Tembah » Feed' href='$site/feed'>";
        
        $html.= "<meta property='twitter:card' content='summary' />";
        $html.="<meta name='twitter:site' content='@tembah.net' />";
        $html.= "<meta name='twitter:title' content='$title' />";
        $html.= "<meta name='twitter:description' content='$desc' />";
        $html.="<meta property='twitter:image' content='$image' />";
        $html.="<meta property='twitter:creator' content='{$author->name}' />";
        
        $html.="<meta name='description'  content='$desc' />";
        $html.="<meta name='keywords' content='$keywords' />";
        $html.="<meta property='website:tag' content='$keywords' />";
        
        $html.="<link rel='canonical' href='$url' />";

        $html.= "<meta property='og:site_name' content='Tembah' />";
        $html.="<meta property='og:image:width' content='400' />";
        $html.="<meta property='og:image:height' content='400' />";
        $html.="<meta property='og:locale' content='ar_QA' />";
        $html.= "<meta property='og:locale:alternate' content='en_GB' />";
        $html.="<meta property='og:type' content='$type' />";
        $html.="<meta property='og:title' content='$title' />";
        $html.="<meta property='og:description'  content='$desc' />";
        $html.="<meta property='og:url' content='$url' />";
        $html.="<meta property='og:image' content='$image' />";
        $html.="<meta property='og:image:secure_url' content='$image' />";
        $html.="<meta property='og:image:type' content='png' />";
        $html.="<meta property='og:image:alt' content='$title' />";
        
        if($type == 'article') {
            $published = $seo && @$seo->published ? $seo->published : Carbon::now()->format("Y-m-d H:m:s");
            $modified = $seo && @$seo->modified ? $seo->modified : Carbon::now()->format("Y-m-d H:m:s");

            $html.="<meta property='og:article:published_time' content='$published' />";
            $html.="<meta property='og:article:modified_time' content='$modified' />";
            $html.="<meta property='og:article:author' content='{$author->name}' />";
            $html.= "<meta property='og:article:tag' content='$keywords' />";
        }

        $schema = json_encode(getSchema($seo), JSON_PRETTY_PRINT);

        $html.="<script type='application/ld+json'>$schema</script>";

        return mb_convert_encoding($html, 'HTML-ENTITIES', 'UTF-8');
    }
}


if (!function_exists('getTeamSquad')) {
    function getTeamSquad($squad)
    {
        if (!$squad || $squad == null || $squad == 'null') return [];

        $squad = (array) $squad->player;

        $playerIds = collect($squad)->map(fn($player) => $player->{"@id"})->values()->toArray();

        $storedPlayers = Player::whereIn("player_id", $playerIds)->get();

        return collect($squad)->map(function ($player) use ($storedPlayers) {

            $pl = null;

            if ($storedPlayers->count()) {
                $pl = $storedPlayers->first(fn($item) => $item->player_id == $player->{"@id"});
            }

            if (!$pl) StorePlayerJob::dispatch($player->{"@id"}, $player->{"@number"});

            return  [
                "id" => $player->{"@id"},
                "name" => $player->{"@name"},
                "nameAr" => getArabic($player->{"@name"}),
                "slug" => Str::slug($player->{"@name"}),
                "age" => (int) $player->{"@age"},
                "position" => $player->{"@position"},
                "shirt" => (int) $player->{"@number"},
                "nationality" => @$pl->nationality,
                "nationalityAr" => getArabic(@$pl->nationality),
                "height" => @$pl->height,
                "image" => @$pl->image,
                "countryFlag" => getCountryFlag(@$pl->nationality ?? ""),
                "transferValue" => @$pl->market_value
            ];
        });
    }
}

if (!function_exists('getTeamCoach')) {
    function getTeamCoach($coach)
    {
        if (!$coach || $coach == null || $coach == 'null') return null;

        $coach = (array) $coach;

        $player = Player::where("player_id", $coach["@id"])->first();

        return [
            "id" => $coach["@id"],
            "name" => $coach["@name"],
            "nameAr" => getArabic($coach["@name"]),
            "slug" => Str::slug($coach["@name"]),
            "age" => (int) @$player->age,
            "position" => @$player->position,
            "shirt" => @$player->shirt,
            "nationality" => @$player->nationality,
            "height" => @$player->height,
            "image" => @$player->image,
            "countryFlag" => getCountryFlag(@$player->nationality ?? ""),
            "transferValue" => @$player->market_value
        ];
    }
}

if (!function_exists('getPlayerTrophies')) {
    function getPlayerTrophies($trophies)
    {
        if (!$trophies) return [];

        if (@$trophies->{"@league"}) {
            return [
                "count" => (int) @$trophies->{"@count"},
                "league" => @$trophies->{"@league"},
                "leagueAr" => getArabic(@$trophies->{"@league"}),
                "seasons" => collect(explode(",", @$trophies->{"@seasons"}))->reject(function($item) {
                    return $item == "";
                })->toArray(),
            ];
        }

        foreach ($trophies as $trophy) {
            $data[] = [
                "count" => (int) $trophy->{"@count"},
                "league" => $trophy->{"@league"},
                "leagueAr" => getArabic(@$trophy->{"@league"}),
                "seasons" => collect(explode(",", @$trophy->{"@seasons"}))->reject(function ($item) {
                    return $item == "";
                })->toArray(),
            ];
        }

        return collect($data)->sortBy("count")->values();
    }
}
