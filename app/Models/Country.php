<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class Country extends Model
{
    public $guarded = [];

    protected function createdAt(): Attribute
    {
        return new  Attribute(
            get: fn($created_at) => Carbon::parse($created_at)->diffForHumans(short: true),
        );
    }

    public function leagues()
    {
        return $this->hasMany(League::class);
    }

    public function image(): MorphOne
    {
        return $this->morphOne(Image::class, "imageable");
    }

    public function seo(): MorphOne
    {
        return $this->morphOne(Seo::class, 'seoable');
    }
}
