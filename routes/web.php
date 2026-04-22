<?php

use App\Http\Controllers\AdController;
use App\Http\Controllers\AdRequestController;
use App\Http\Controllers\AllLeaguesController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\AuthorController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CountryController;
use App\Http\Controllers\HeadToHeadController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LeagueController;
use App\Http\Controllers\MatchController;
use App\Http\Controllers\PlayerController;
use App\Http\Controllers\SeasonController;
use App\Http\Controllers\MatchOverviewController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\NewsStatsController;
use App\Http\Controllers\OAuthController;
use App\Http\Controllers\ShowLeagueController;
use App\Http\Controllers\ShowPlayerController;
use App\Http\Controllers\ShowTeamController;
use App\Http\Controllers\SliderController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Spiders\TestSpider;
use RoachPHP\Roach;
use App\Http\Controllers\SoccerController;
use App\Http\Controllers\SoccerLeagueFixtureController;
use App\Http\Controllers\SoccerLeagueStatController;
use App\Http\Controllers\StandingsController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\TeamPlayersController;
use App\Http\Controllers\TopLeaguesController;
use App\Http\Controllers\TransferNewsController;
use App\Http\Controllers\TransferNewsStatController;
use App\Http\Controllers\TransfersController;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Socialite;

Route::get('/{lang?}', [HomeController::class, "index"])->name('home');
Route::get("/matches/{period?}/{lang?}", [MatchController::class, "index"])->name("soccer.matches");
Route::get("/match/teams/{slug?}/{lang?}", [MatchController::class, "show"])->name("soccer.team.matches");
Route::get("/players/{player}/{shirt}/{slug}/{lang?}", ShowPlayerController::class)->name("show.player");
Route::get("/team/{ids}/{slug}/{lang?}", [ShowTeamController::class, "index"])->name("soccer.show.team.index");

Route::get("request/{lang?}", [AdRequestController::class, "index"])->name("ad.request.index");



Route::get('/oauth/callback', function () {
    $user = Socialite::driver('facebook')->user();

    Log::info(json_encode($user));

    return redirect('/dashboard/en');

    // $user->token
});

Route::middleware(['auth', 'verified'])->group(function () {

    
    Route::get('dashboard/{lang?}', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::as("slider.")->prefix("slider/")->group(function() {
        Route::get("{lang?}", [SliderController::class, "index"])->name("index");
    });

    Route::as("oauth.")->prefix("oath/")->group(function() {
        Route::get('/facebook', function () {
            return Socialite::driver('facebook')->redirect();
        })->name("facebook");
    });

    Route::as("ad.")->prefix("ad/")->group(function() {
        Route::get("{lang?}", [AdController::class, "index"])->name("index");
        Route::get("create/{lang?}", [AdController::class, "create"])->name("create");
        Route::match(["post", "put"], "store", [AdController::class, "store"])->name("store");
    });

    Route::as("author.")->prefix("author/")->group(function() {
        Route::get("{lang?}", [AuthorController::class, "index"])->name("index");
        Route::match(["post", "put"],"store", [AuthorController::class, "store"])->name("store");
        Route::get("create/{lang?}", [AuthorController::class, "create"])->name("create");
        
    });

    Route::as("tag.")->prefix("tag/")->group(function() {
        Route::get("{lang?}", [TagController::class, "index"])->name("index");
        Route::get("create/{lang?}", [TagController::class, "create"])->name("create");
        Route::match(["post", "put"],"store", [TagController::class, "store"])->name("store");
    });

    Route::as("category.")->prefix("category/")->group(function() {
        Route::get("{lang?}", [CategoryController::class, "index"])->name("index");
        Route::get("create/{lang?}", [CategoryController::class, "create"])->name("create");
        Route::match(["post", "put"],"store", [CategoryController::class, "store"])->name("store");
    });

    Route::as("news.")->prefix("news/")->group(function() {
        Route::get("{lang?}", [NewsController::class, "index"])->name("index");
        Route::get("create/{lang?}", [NewsController::class, "create"])->name("create");
        Route::get("show/{lang?}", [NewsController::class, "show"])->name("show");
        Route::get("edit/{slug}/{lang?}", [NewsController::class, "edit"])->name("edit");
        Route::match(["post", "put"],"store", [NewsController::class, "store"])->name("store");
        Route::get("stats/{lang?}", [NewsStatsController::class, "index"])->name("stats");

        Route::as("transfer.")->prefix("transfer/")->group(function () {
            Route::get("{lang?}", [TransferNewsController::class, "index"])->name("index");
            Route::get("create/{lang?}", [TransferNewsController::class, "create"])->name("create");
            Route::match(["post", "put"],"store", [TransferNewsController::class, "store"])->name("store");
            Route::get("stats/{lang?}", [TransferNewsStatController::class, "index"])->name("stats");
        });
    });

    Route::as("article.")->prefix("article/")->group(function () {
        Route::get("{lang?}", [ArticleController::class, "index"])->name("index");
        Route::match(["post", "put"],"store", [ArticleController::class, "store"])->name("store");
        Route::get("create/{lang?}", [ArticleController::class, "create"])->name("create");
    });

    Route::as("country.")->prefix("country/")->group(function () {
        Route::get("{lang?}", [CountryController::class, "index"])->name("index");
    });

    Route::as("league.")->prefix("league/")->group(function () {
        Route::get("{lang?}", [LeagueController::class, "index"])->name("index");
    });

    Route::as("team.")->prefix("team/")->group(function () {
        Route::get("{lang?}", [TeamController::class, "index"])->name("index");
    });

    Route::as("player.")->prefix("player/")->group(function () {
        Route::get("{lang?}", [PlayerController::class, "index"])->name("index");
    });

    Route::as("dropdown.")->prefix("dropdown/")->group(function () {
        Route::get("categories", fn() => categories())->name("categories");
        Route::get("tags", fn() => tags())->name("tags");
    });

    Route::get("/oath/{lang?}", [OAuthController::class, "index"])->name("oauth.index");
});


Route::get("/set/preffered/lang/{lang}", function ($lang) {
    if (! in_array($lang, ['en', 'ar'])) {
        abort(400);
    }
    App::setLocale($lang);
    session(["lang" => $lang]);

})->name("prefLang");

//API
Route::prefix("")->group(function () {
    Route::get("/all/games/{period?}", [SoccerController::class, "games"])->name("soccer.fixtures");
    Route::get("/live/games", [SoccerController::class, "live"])->name("live.games");
    Route::get("/fixtures/{league?}", [SoccerController::class, "fixtures"]);
    Route::get("/league/team/data/{leagueId?}", [SoccerController::class, "getLeagueTeamData"]);
    Route::get("/league/fixtures/{leagueId?}", [SoccerController::class, "getLeagueFixtures"])->name("league.fixtures");
    Route::get("/fixtures/history/{league}/{season}", SoccerLeagueFixtureController::class)->name("league.history.fixtures");
    Route::get("/statistics/{league}/{season}", SoccerLeagueStatController::class)->name("league.statistics");

    Route::get("/league/refresh/{lang?}", [SoccerController::class, "store"]);
    Route::get("/league/season/all/{lang?}", [SoccerController::class, "season"]);
    Route::get("/league/team/refresh/{lang?}", [SoccerController::class, "teams"]);

    Route::get("/league/team/{team_id}/show/{lang?}", [TeamController::class, "show"]);

    Route::get("/league/standings/{league}/{season?}", StandingsController::class)->name("league.standings");
    Route::get("/league/all/{lang?}", AllLeaguesController::class)->name("all.leagues");
    Route::get("/league/top/{lang?}", TopLeaguesController::class)->name("top.leagues");
    Route::get("/league/{id}/seasons/{lang?}", SeasonController::class)->name("league.seasons");

    Route::get("/league/show/{slug?}/{lang?}", ShowLeagueController::class)->name("index.league");

    Route::get("/teams/league/{league?}/players/{lang?}", TeamPlayersController::class)->name("teams.league.players");
    Route::get("/teams/league/{league?}/transfers/{lang?}", TransfersController::class)->name("teams.league.transfers");

    Route::get("/match/overview/{slug?}", MatchOverviewController::class)->name("soccer.match.overview");
    Route::get("/team/match/head-to-head/{slug}/h2h", HeadToHeadController::class)->name("soccer.show.team.h2h");
    
});


Route::get("/roach", function () {
    $items = Roach::collectSpider(TestSpider::class);

    dd($items);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
