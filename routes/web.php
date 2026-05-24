<?php

use App\Actions\GameCalenderGeneratorAction;
use App\Actions\GetHomePageNewsAction;
use App\Enums\NewsType;
use App\Http\Controllers\AdController;
use App\Http\Controllers\AdRequestController;
use App\Http\Controllers\AllLeaguesController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\ArticleStatsController;
use App\Http\Controllers\ArticleViewController;
use App\Http\Controllers\AuthorController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CountryController;
use App\Http\Controllers\FixturesController;
use App\Http\Controllers\HeadToHeadController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\HomePageArticleController;
use App\Http\Controllers\HomePageCategoryController;
use App\Http\Controllers\LeagueController;
use App\Http\Controllers\MatchController;
use App\Http\Controllers\PlayerController;
use App\Http\Controllers\SeasonController;
use App\Http\Controllers\MatchOverviewController;
use App\Http\Controllers\Mobile\LeaguesController;
use App\Http\Controllers\Mobile\MoreController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\NewsletterSubController;
use App\Http\Controllers\NewsletterUnsubController;
use App\Http\Controllers\NewsStatsController;
use App\Http\Controllers\NewsViewsController;
use App\Http\Controllers\OAuthController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\PagesController;
use App\Http\Controllers\ShowArticleController;
use App\Http\Controllers\ShowCategoryNewsController;
use App\Http\Controllers\ShowLeagueController;
use App\Http\Controllers\ShowLiveScoresController;
use App\Http\Controllers\ShowNewsController;
use App\Http\Controllers\ShowPlayerController;
use App\Http\Controllers\ShowTagNewsController;
use App\Http\Controllers\ShowTeamController;
use App\Http\Controllers\ShowTextNewsController;
use App\Http\Controllers\ShowTransferNewsController;
use App\Http\Controllers\ShowTrendingNewsController;
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
use App\Http\Controllers\TeamShowController;
use App\Http\Controllers\TopLeaguesController;
use App\Http\Controllers\TransferCenterController;
use App\Http\Controllers\TransferNewsController;
use App\Http\Controllers\TransferNewsStatController;
use App\Http\Controllers\TransfersController;
use App\Http\Controllers\TrendingNewsController;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Laravel\Socialite\Socialite;

Route::feeds();

Route::get('/{lang?}', [HomeController::class, "index"])->name('home');

Route::get("/matches/{period?}/{lang?}", [MatchController::class, "index"])->name("soccer.matches");
Route::get("/match/teams/{slug?}/{lang?}", [MatchController::class, "show"])->name("soccer.team.matches");
Route::get("/players/{player}/{shirt}/{slug}/{lang?}", ShowPlayerController::class)->name("show.player");
Route::get("/team/{ids}/{slug}/{lang?}", [ShowTeamController::class, "index"])->name("soccer.show.team.index");



Route::get("request/{lang?}", [AdRequestController::class, "index"])->name("ad.request.index");

Route::as("home.")->prefix("guest/api/")->group(function() {
    Route::get("latest-news/{limit?}", fn($limit) => GetHomePageNewsAction::handle(newsType: NewsType::Text, count: $limit, randomize: true))->name("latest-news");
    Route::get("transfer-news", fn() => GetHomePageNewsAction::handle(newsType: NewsType::Transfer, count: 4, randomize: true))->name("transfer-news");
    Route::get("top-recent-news", fn() => GetHomePageNewsAction::handle(newsType: NewsType::Text, isTop: true, getRecent: true))->name("top-recent-news");
    Route::get("sliders", fn() => GetHomePageNewsAction::handle(newsType: NewsType::Text, getSlider: true))->name("sliders");
    Route::get("trending/news", TrendingNewsController::class)->name("trending.news");
    Route::get("articles", HomePageArticleController::class)->name("articles.index");
    Route::get("category", [HomePageCategoryController::class, "index"])->name("category.index");
});

Route::as('mobile.')->prefix("mobile/")->group(function() {
    Route::get("more/{lang?}", MoreController::class)->name("more");
    Route::get("leagues/{lang?}", LeaguesController::class)->name("leagues");
});

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

    Route::prefix("admin/")->group(function() {
        Route::as("slider.")->prefix("slider/")->group(function () {
            Route::get("{lang?}", [SliderController::class, "index"])->name("index");
            Route::get("show/{lang?}", [SliderController::class, "show"])->name("show");
            Route::delete("delete/{slider}", [SliderController::class, "delete"])->name("delete");
        });

        Route::as("oauth.")->prefix("oath/")->group(function () {
            Route::get('/facebook', function () {
                return Socialite::driver('facebook')->redirect();
            })->name("facebook");
        });

        Route::as("ad.")->prefix("ad/")->group(function () {
            Route::get("{lang?}", [AdController::class, "index"])->name("index");
            Route::get("create/{lang?}", [AdController::class, "create"])->name("create");
            Route::match(["post", "put"], "store", [AdController::class, "store"])->name("store");
            Route::get("{ad}/edit/{lang?}", [AdController::class, "edit"])->name("edit");
            Route::get("show/{lang?}", [AdController::class, "show"])->name("show");
            Route::delete("delete/{ad}", [AdController::class, "delete"])->name("delete");
        });

        Route::as("author.")->prefix("author/")->group(function () {
            Route::get("{lang?}", [AuthorController::class, "index"])->name("index");
            Route::match(["post", "put"], "store", [AuthorController::class, "store"])->name("store");
            Route::get("create/{lang?}", [AuthorController::class, "create"])->name("create");
            Route::get("{author}/edit/{lang?}", [AuthorController::class, "edit"])->name("edit");
            Route::get("show/{lang?}", [AuthorController::class, "show"])->name("show");
            Route::delete("delete/{author}", [AuthorController::class, "delete"])->name("delete");
        });

        Route::as("tag.")->prefix("tag/")->group(function () {
            Route::get("{lang?}", [TagController::class, "index"])->name("index");
            Route::get("create/{lang?}", [TagController::class, "create"])->name("create");
            Route::match(["post", "put"], "store", [TagController::class, "store"])->name("store");
            Route::get("{tag}/edit/{lang?}", [TagController::class, "edit"])->name("edit");
            Route::get("show/{lang?}", [TagController::class, "show"])->name("show");
            Route::delete("delete/{tag}", [TagController::class, "delete"])->name("delete");
        });

        Route::as("category.")->prefix("category/")->group(function () {
            Route::get("{lang?}", [CategoryController::class, "index"])->name("index");
            Route::get("create/{lang?}", [CategoryController::class, "create"])->name("create");
            Route::match(["post", "put"], "store", [CategoryController::class, "store"])->name("store");
            Route::get("{category}/edit/{lang?}", [CategoryController::class, "edit"])->name("edit");
            Route::get("show/{lang?}", [CategoryController::class, "show"])->name("show");
            Route::delete("delete/{category}", [CategoryController::class, "delete"])->name("delete");
        });

        Route::as("news.")->prefix("news/")->group(function () {
            Route::get("{lang?}", [NewsController::class, "index"])->name("index");
            Route::get("create/{lang?}", [NewsController::class, "create"])->name("create");
            Route::get("show/{lang?}", [NewsController::class, "show"])->name("show");
            Route::get("edit/{slug}/{lang?}", [NewsController::class, "edit"])->name("edit");
            Route::match(["post", "put"], "store", [NewsController::class, "store"])->name("store");
            Route::delete("delete/{news}", [NewsController::class, "delete"])->name("delete");

            Route::get("stats/{lang?}", [NewsStatsController::class, "index"])->name("stats");
            Route::get("stats/show/{lang?}", [NewsStatsController::class, "show"])->name("stats.show");

            Route::as("transfer.")->prefix("transfer/")->group(function () {
                Route::get("{lang?}", [TransferNewsController::class, "index"])->name("index");
                Route::get("create/{lang?}", [TransferNewsController::class, "create"])->name("create");
                Route::match(["post", "put"], "store", [TransferNewsController::class, "store"])->name("store");
                Route::get("show/{lang?}", [TransferNewsController::class, "show"])->name("show");
                Route::get("edit/{slug}/{lang?}", [TransferNewsController::class, "edit"])->name("edit");
                Route::delete("delete/{news}", [TransferNewsController::class, "delete"])->name("delete");
                Route::get("stats/{lang?}", [TransferNewsStatController::class, "index"])->name("stats");
            });
        });

        Route::as("article.")->prefix("article/")->group(function () {
            Route::get("{lang?}", [ArticleController::class, "index"])->name("index");
            Route::get("create/{lang?}", [ArticleController::class, "create"])->name("create");
            Route::match(["post", "put"], "store", [ArticleController::class, "store"])->name("store");
            Route::get("show/{lang?}", [ArticleController::class, "show"])->name("show");
            Route::get("edit/{slug}/{lang?}", [ArticleController::class, "edit"])->name("edit");
            Route::delete("delete/{article}", [ArticleController::class, "delete"])->name("delete");
            Route::get("stats/{lang?}", [ArticleStatsController::class, "index"])->name("stats");
            Route::get("stats/show/{lang?}", [ArticleStatsController::class, "show"])->name("stats.show");
        });

        Route::as("country.")->prefix("country/")->group(function () {
            Route::get("{lang?}", [CountryController::class, "index"])->name("index");
            Route::get("show/{lang?}", [CountryController::class, "show"])->name("show");
            Route::get("edit/{country}/{lang?}", [CountryController::class, "update"])->name("edit");
            Route::match(["post", "put"], "store", [CountryController::class, "store"])->name("store");
        });

        Route::as("league.")->prefix("league/")->group(function () {
            Route::get("{lang?}", [LeagueController::class, "index"])->name("index");
            Route::get("show/{lang?}", [LeagueController::class, "show"])->name("show");
            Route::get("edit/{league}/{lang?}", [LeagueController::class, "update"])->name("edit");
            Route::match(["post", "put"], "store", [LeagueController::class, "store"])->name("store");
        });

        Route::as("team.")->prefix("team/")->group(function () {
            Route::get("{lang?}", [TeamController::class, "index"])->name("index");
            Route::get("show/{lang?}", [TeamController::class, "show"])->name("show");
            Route::get("edit/{team}/{lang?}", [TeamController::class, "update"])->name("edit");
            Route::match(["post", "put"], "store", [TeamController::class, "store"])->name("store");
        });

        Route::as("player.")->prefix("player/")->group(function () {
            Route::get("{lang?}", [PlayerController::class, "index"])->name("index");
            Route::get("show/{lang?}", [PlayerController::class, "show"])->name("show");
            Route::get("edit/{player}/{lang?}", [PlayerController::class, "update"])->name("edit");
            Route::match(["post", "put"], "store", [PlayerController::class, "store"])->name("store");
        });

        Route::as("fixtures.")->prefix("fixtures/")->group(function () {
            Route::get("{lang?}", [FixturesController::class, "index"])->name("index");
            Route::get("show/{lang?}", [FixturesController::class, "show"])->name("show");
            Route::get("edit/{fixture}/{lang?}", [FixturesController::class, "update"])->name("edit");
            Route::match(["post", "put"], "store", [FixturesController::class, "store"])->name("store");
        });

        Route::as("dropdown.")->prefix("dropdown/")->group(function () {
            Route::get("categories", fn() => categories())->name("categories");
            Route::get("tags", fn() => tags())->name("tags");
        });

        Route::get("/oath/{lang?}", [OAuthController::class, "index"])->name("oauth.index");

        Route::as("seo.")->prefix("seo/")->group(function () {
            Route::get("page/{lang?}", [PageController::class, "index"])->name("page.index");
            Route::get("page/show/{id}/{lang?}", [PageController::class, "show"])->name("page.show");
            Route::post("page/store", [PageController::class, "store"])->name("page.store");
        });

        Route::as("newsletter.")->prefix("newsletter/")->group(function () {
            Route::get("{lang?}", [NewsletterController::class, "index"])->name("index");
            Route::get("create/{lang?}", [NewsletterController::class, "create"])->name("create");
            Route::get("show/{lang?}", [NewsletterController::class, "show"])->name("show");
            Route::post("store/{lang?}", [NewsletterController::class, "store"])->name("store");
            Route::delete("/delete/{newsletter}", [NewsletterController::class, "delete"])->name("delete");
        });
    });
});


Route::get("/set/preffered/lang/{lang}", function ($lang) {
    if (! in_array($lang, ['en', 'ar'])) {
        abort(400);
    }
    App::setLocale($lang);
    // session(["lang" => $lang]);

    Session::put("lang", $lang);

})->name("prefLang");

//API
Route::prefix("")->group(function () {
    Route::get("/all/games/{period?}", [SoccerController::class, "games"])->name("soccer.fixtures");
    Route::get("/live/games", [SoccerController::class, "live"])->name("live.games");
    Route::get("/live/scores/{lang?}", ShowLiveScoresController::class)->name("live.scores");
    Route::get("/fixtures/{league?}", [SoccerController::class, "fixtures"]);
    Route::get("/league/team/data/{leagueId?}", [SoccerController::class, "getLeagueTeamData"]);
    Route::get("/league/fixtures/{leagueId?}", [SoccerController::class, "getLeagueFixtures"])->name("league.fixtures");
    Route::get("/fixtures/history/{league}/{season}", SoccerLeagueFixtureController::class)->name("league.history.fixtures");
    Route::get("/statistics/{league}/{season}", SoccerLeagueStatController::class)->name("league.statistics");

    Route::get("/league/refresh/{lang?}", [SoccerController::class, "store"]);
    Route::get("/league/season/all/{lang?}", [SoccerController::class, "season"]);
    Route::get("/league/team/refresh/{lang?}", [SoccerController::class, "teams"]);

    Route::get("/league/team/{team_id}/show/{lang?}", TeamShowController::class);

    Route::get("/league/standings/{league}/{season?}", StandingsController::class)->name("league.standings");
    Route::get("/league/all/{lang?}", AllLeaguesController::class)->name("all.leagues");
    Route::get("/league/top/{lang?}", TopLeaguesController::class)->name("top.leagues");
    Route::get("/league/{id}/seasons/{lang?}", SeasonController::class)->name("league.seasons");

    Route::get("/league/show/{slug?}/{lang?}", ShowLeagueController::class)->name("index.league");

    Route::get("/teams/league/{league?}/players/{lang?}", TeamPlayersController::class)->name("teams.league.players");
    Route::get("/teams/league/{league?}/transfers/{lang?}", TransfersController::class)->name("teams.league.transfers");

    Route::get("/match/overview/{slug?}", MatchOverviewController::class)->name("soccer.match.overview");
    Route::get("/team/match/head-to-head/{slug}/h2h", HeadToHeadController::class)->name("soccer.show.team.h2h");

    Route::get("/transfer-center/{lang?}", [TransferCenterController::class, "index"])->name("index.transfer.center");
    
});

Route::get("newsletter/unsub/{email}", NewsletterUnsubController::class)->name("newsletter.unsub");
Route::post("newsletter/sub", NewsletterSubController::class)->name("newsletter.sub");

Route::get("/news/{slug}/tags/{lang?}", [ShowTagNewsController::class, "index"])->name("tag.news");
Route::get("/news/tag/show/{id}/news/paginate", [ShowTagNewsController::class, "show"])->name("tag.news.show");

Route::get("/news/{slug}/categories/{lang?}", [ShowCategoryNewsController::class, "index"])->name("category.news.index");
Route::get("/news/category/show/{id}/news/paginate", [ShowCategoryNewsController::class, "show"])->name("category.news.show");

Route::get("/news/trending/{lang?}", [ShowTrendingNewsController::class, "index"])->name("trending.news.index");
Route::get("/news/trending/show/news/paginate", [ShowTrendingNewsController::class, "show"])->name("trending.news.show");

Route::post("/news/views/update/stats", NewsViewsController::class)->name("news.views.store");
Route::post("/article/views/update/stats", ArticleViewController::class)->name("article.views.store");

Route::get("/news/articles/{lang?}", [ShowArticleController::class, "index"])->name("article.news.index");
Route::get("/news/article/show/news/paginate", [ShowArticleController::class, "show"])->name("article.news.show");

Route::get("/news/all/{lang?}", [ShowTextNewsController::class, "index"])->name("text.news.index");
Route::get("/news/all/show/news/paginate", [ShowTextNewsController::class, "show"])->name("text.news.show");

Route::get("/news/transfer/{lang?}", [ShowTransferNewsController::class, "index"])->name("transfer.news.index");
Route::get("/news/transfers/show/news/paginate", [ShowTransferNewsController::class, "show"])->name("transfer.news.show");

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

// Must remain below
Route::get("/news/{slug}/{type}/{lang?}", ShowNewsController::class)->name("show.news");
Route::get("/news/{slug}/{type}/{page}/{lang?}", ShowNewsController::class)->name("show.news.cat-tag");
Route::get('/{slug}/{lang?}', PagesController::class)->name("pages");






Route::get("/roach", function () {
    $items = Roach::collectSpider(TestSpider::class);

    dd($items);
});


