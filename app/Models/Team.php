<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Spatie\Sitemap\Contracts\Sitemapable;
use Spatie\Sitemap\Tags\Url;

class Team extends Model implements Sitemapable
{
    use \Staudenmeir\EloquentJsonRelations\HasJsonRelationships;

    protected $guarded = [];

    public function toSitemapTag(): Url | string | array
    {
        return Url::create(route("soccer.show.team.index", ["ids" => $this->team_id, "slug" => $this->slug]))
            ->setLastModificationDate(Carbon::create($this->updated_at))
            ->setChangeFrequency(Url::CHANGE_FREQUENCY_ALWAYS)
            ->setPriority(0.1)
            ->addImage($this->image, "{$this->name}");
    }


    protected function createdAt(): Attribute
    {
        return new  Attribute(
            get: fn($created_at) => Carbon::parse($created_at)->diffForHumans(short: true),
        );
    }

    protected function image(): Attribute
    {
        return Attribute::make(
            get: fn(string | null $image) => $image ? url("/") . "/storage/uploads/images/teams/$image" : null,
        );
    }

    protected function venueImage(): Attribute
    {
        return Attribute::make(
            get: fn(string | null $venue_image) => $venue_image  ? url("/") . "/storage/uploads/images/venues/$venue_image" : null,
        );
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            // 'leagues' => 'array',
            // 'venue_address' => 'array',
            // 'venue_city' => 'array',
            // 'squad' => 'array',
            // 'coach' => 'array',
            // 'transfers' => 'array',
            // 'statistics' => 'array',
            // 'detailed_stats' => 'array',
            // 'sidelined' => 'array',
            // 'trophies' => 'array',
        ];
    }

    public function country() {
        return $this->belongsTo(Country::class);
    }

    /**
     * Get the news seo.
     */
    public function seo(): MorphOne
    {
        return $this->morphOne(Seo::class, 'seoable');
    }
}
