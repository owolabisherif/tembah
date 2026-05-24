<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Spatie\Sitemap\Contracts\Sitemapable;
use Spatie\Sitemap\Tags\Url;

class Player extends Model implements Sitemapable
{
    protected $guarded = [];

    public function toSitemapTag(): Url | string | array
    {
        return Url::create(route("show.player", ["player" => $this->player_id, "shirt" => $this->shirt, "slug" => $this->slug]))
            ->setLastModificationDate(Carbon::create($this->updated_at))
            ->setChangeFrequency(Url::CHANGE_FREQUENCY_ALWAYS)
            ->setPriority(0.1)
            ->addImage($this->image ?? url("/").'/assets/images/logo2.png', "{$this->name}");
    }



    public function currentTeam() {
        return $this->belongsTo(Team::class, "team_id", "team_id");
    }

    protected function image(): Attribute
    {
        return Attribute::make(
            get: fn(string | null $image) => $image ? url("/") . "/storage/uploads/images/players/$image" : null,
        );
    }


    protected function teamFlag(): Attribute
    {
        return Attribute::make(
            get: fn(string | null $team_flag ) => $team_flag  ? url("/") . "/assets/images/teams/$team_flag" : null,
        );
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
}
