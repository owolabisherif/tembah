<?php

namespace App\Models;

use App\Enums\NewsType;
use App\Traits\ImageRelationship;
use Illuminate\Database\Eloquent\Model;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class News extends Model
{
    use HasSlug, ImageRelationship, \Staudenmeir\EloquentJsonRelations\HasJsonRelationships;

    protected $guarded = [];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'options' => 'json',
            "type" => NewsType::class
        ];
    }

    /**
     * Get the options for generating the slug.
     */
    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('title')
            ->saveSlugsTo('slug');
    }

    public function author() {
        return $this->belongsTo(Author::class, "author_id");
    }

    /**
     * Get the news tags.
     */
    public function tags(): \Staudenmeir\EloquentJsonRelations\Relations\BelongsToJson
    {
        return $this->belongsToJson(Tag::class, 'options->tag_ids');
    }

    /**
     * Get the news teams.
     */
    public function teams(): \Staudenmeir\EloquentJsonRelations\Relations\BelongsToJson
    {
        return $this->belongsToJson(Team::class, 'options->team_ids');
    }

    /**
     * Get the news teams.
     */
    public function leagues(): \Staudenmeir\EloquentJsonRelations\Relations\BelongsToJson
    {
        return $this->belongsToJson(League::class, 'options->league_ids');
    }

    /**
     * Get the news categories.
     */
    public function categories(): \Staudenmeir\EloquentJsonRelations\Relations\BelongsToJson
    {
        return $this->belongsToJson(Category::class, 'options->category_ids');
    }

    /**
     * Get the news seo.
     */
    public function seo(): MorphOne
    {
        return $this->morphOne(Seo::class, 'seoable');
    }

    public function slider(): MorphOne
    {
        return $this->morphOne(Slider::class, "sliderable");
    }

    /**
     * Get the comments for news.
     */
    public function comments(): HasMany
    {

        return $this->hasMany(Comment::class);
    }
}
