<?php

namespace App\Models;

use App\Traits\Slugify;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Spatie\Sitemap\Contracts\Sitemapable;
use Spatie\Sitemap\Tags\Url;



class League extends Model implements Sitemapable
{
    use Slugify;

    public $guarded = [];

    public function toSitemapTag(): Url | string | array
    {
        return Url::create(route('index.league', ["slug" => $this->slug]))
            ->setLastModificationDate(Carbon::create($this->updated_at))
            ->setChangeFrequency(Url::CHANGE_FREQUENCY_ALWAYS)
            ->setPriority(0.1)
            ->addImage($this->logo, "{$this->name}");
    }


    public function country()
    {
        return $this->belongsTo(Country::class, "country_id");
    }

    public function seo(): MorphOne
    {
        return $this->morphOne(Seo::class, 'seoable');
    }

    protected function createdAt(): Attribute
    {
        return new  Attribute(
            get: fn($created_at) => Carbon::parse($created_at)->diffForHumans(short: true),
        );
    }


  
    protected function logo(): Attribute
    {
        return Attribute::make(
            get: fn(string $logo) => url("/") . "/storage/uploads/images/leagues/{$logo}"
        );
    }

    


    /**
     * Get the options for generating the slug.
     */
    public function getSlugOptions(): array
    {
        return [
            "column" => ["name", "name_ar"],
            "saveTo" => ["slug", "slug_ar"],
            "lang" => ["en", "ar"],
        ];
    }
}
