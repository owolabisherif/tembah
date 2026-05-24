<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Override;

class Cacher extends Cache
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Creates a cache conditionally.
     * 
     * @param bool $isTrue
     * @param string $key
     * @param mixed $ttl
     * @param \Closure $callback
     * @return mixed
     */
    public static function rememberIf(bool $isTrue, string $key, mixed $ttl, \Closure $callback) {
        if(!$isTrue) {
            return $callback();
        }

        return self::remember($key, $ttl, $callback);
    }

    /**
     * Refresh a cache.
     * 
     * @param string $key
     * @param mixed $ttl
     * @param \Closure $callback
     * @return mixed
     */

    public static function refresh(string $key, mixed $ttl, \Closure $callback) {
        self::forget($key);

        return self::remember($key, $ttl, $callback);
    }

    public static function refreshRememberForever(string $key, \Closure $callback)
    {
        self::forget($key);

        return self::rememberForever($key, $callback);
    }
}
