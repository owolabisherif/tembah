<?php

namespace App\Models;

use App\Enums\NewsType;
use App\Traits\ImageRelationship;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Spatie\Sitemap\Tags\Url;
use Spatie\Feed\Feedable;
use Spatie\Feed\FeedItem;
use Spatie\Sitemap\Contracts\Sitemapable;

class News extends Model implements Sitemapable, Feedable
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

    protected function createdAt(): Attribute
    {
        return new  Attribute(
            get: fn($created_at) => Carbon::parse($created_at)->diffForHumans(short: true),
        );
    }

    protected function videoUrl(): Attribute
    {
        return Attribute::make(
            get: fn(string | null $video_url) => $video_url ? url("/") . "/storage/uploads/videos" . "/$video_url" : null
        );
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


    public function toSitemapTag(): Url | string | array
    {
        return Url::create(route('show.news', ["slug" => $this->slug, "type" => $this->type == NewsType::Transfer ? 'transfer' : "all"]))
            ->setLastModificationDate(Carbon::create($this->updated_at))
            ->setChangeFrequency(Url::CHANGE_FREQUENCY_YEARLY)
            ->setPriority(0.1)
            ->addImage($this->image->name, "{$this->title}");
    }

    public function toFeedItem(): FeedItem
    {
        $route = route("show.news", ["slug" => $this->slug, "type" => "all"]);

        return FeedItem::create([
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'summary' => @$this->seo->meta_desc ?? strip_tags($this->body),
            'body' => @$this->seo->meta_desc ?? strip_tags($this->body),
            'updated' => $this->updated_at,
            'link' => $route,
            'image' => $this->image->name,
            'authorName' => @$this->author->name ?? "Tembah",
            'authorEmail' => @$this->author->email ?? "info@tembah.net",
        ]);
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
     * Get the news leagues.
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
     * Get the news players.
     */
    public function players(): \Staudenmeir\EloquentJsonRelations\Relations\BelongsToJson
    {
        return $this->belongsToJson(Player::class, 'options->player_ids');
    }

    /**
     * Get the news countries.
     */
    public function countries(): \Staudenmeir\EloquentJsonRelations\Relations\BelongsToJson
    {
        return $this->belongsToJson(Player::class, 'options->country_ids');
    }


    public function stats() {
        return $this->hasMany(NewsViews::class, "news_id");
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

    public function image(): MorphOne
    {
        return $this->morphOne(Image::class, "imageable");
    }
}
