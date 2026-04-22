<?php

namespace App\Spiders;

use Generator;
use RoachPHP\Downloader\Middleware\RequestDeduplicationMiddleware;
use RoachPHP\Extensions\LoggerExtension;
use RoachPHP\Extensions\StatsCollectorExtension;
use RoachPHP\Http\Response;
use RoachPHP\Spider\BasicSpider;
use RoachPHP\Spider\ParseResult;
use App\TestSpiderProc;

class TestSpider extends BasicSpider
{
    public array $startUrls = [
        "https://www.goal.com/en-qa/news"
    ];

    public array $downloaderMiddleware = [
        RequestDeduplicationMiddleware::class,
    ];

    public array $spiderMiddleware = [
        //
    ];

    public array $itemProcessors = [
        // TestSpiderProc::class,
    ];

    public array $extensions = [
        LoggerExtension::class,
        StatsCollectorExtension::class,
    ];

    public int $concurrency = 2;

    public int $requestDelay = 1;

    /**
     * @return Generator<ParseResult>
     */
    public function parse(Response $response): Generator
    {
        $title = $response->filter('h3')->text();

        $subtitle = $response
            ->filter('p')
            ->text();

        foreach ($title as $t) {
            print($t);
        }

        yield $this->item([
            'title' => $title,
            'subtitle' => $subtitle,
        ]);
    }
}
