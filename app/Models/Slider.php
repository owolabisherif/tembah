<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Slider extends Model
{
    protected $guarded = [];

    protected function name(): Attribute
    {
        return Attribute::make(
            get: fn(string $name) => url("/") . "/storage/uploads/images" . "/$name"
        );
    }

    protected function createdAt(): Attribute
    {
        return new  Attribute(
            get: fn($created_at) => Carbon::parse($created_at)->diffForHumans(short: true),
        );
    }

    /**
     * Get the parent sliderable model (user or post).
     */
    public function sliderable(): MorphTo
    {
        return $this->morphTo();
    }
}
