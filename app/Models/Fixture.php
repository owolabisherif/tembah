<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Spatie\Sitemap\Contracts\Sitemapable;
use Spatie\Sitemap\Tags\Url;

class Fixture extends Model implements Sitemapable
{
    // public $timestamps = false;

    protected $guarded = [];

    public function toSitemapTag(): Url | string | array
    {
        return Url::create(route("soccer.team.matches", ["slug" => $this->slug]))
            ->setLastModificationDate(Carbon::create($this->updated_at))
            ->setChangeFrequency(Url::CHANGE_FREQUENCY_ALWAYS)
            ->setPriority(0.1)
            ->addImage($this->matchLeague->logo, "{$this->slug}");
    }

    protected $casts = [
        "match" => "array",
    ];

    public function matchLeague() {
        return $this->belongsTo(League::class, "league_id", "league_id");
    }

    public function homeTeam() {
        return $this->belongsTo(Team::class, "home_team_id", "team_id");
    }

    public function awayTeam() {
        return $this->belongsTo(Team::class, "away_team_id", "team_id");
    }


    public function seo(): MorphOne
    {
        return $this->morphOne(Seo::class, 'seoable');
    }
}
