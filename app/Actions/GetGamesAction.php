<?php

namespace App\Actions;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GetGamesAction
{

    private $key;
    private $endPoint;
    

    public function  __construct(private string $period)
    {
        $this->key =  config('api.key');
        $this->endPoint = config('api.endpoint');
    }

    public static function make(string $period): static {
        return new static($period);
    }

    public function handle()
    {
        try {
            $response = Http::get("{$this->endPoint}/{$this->key}/soccernew/{$this->period}?json=1")->throw();
    
            $collection = $response->object();
    
            return @$collection->scores->category;
        } catch (\Exception $e) {
            Log::error($e);

            return [];
        }
    }
}
