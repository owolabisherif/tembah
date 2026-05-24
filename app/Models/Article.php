<?php

namespace App\Models;

use App\Enums\NewsType;
use App\Traits\ImageRelationship;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Spatie\Sitemap\Tags\Url;
use Spatie\Sitemap\Contracts\Sitemapable;
use Spatie\Feed\Feedable;
use Spatie\Feed\FeedItem;


class Article extends Model implements Sitemapable, Feedable
{
    use \Staudenmeir\EloquentJsonRelations\HasJsonRelationships, ImageRelationship;
    
    protected $guarded = [];

    protected $casts = [
        "options" => "json",
        "type" => NewsType::class
    ];

    protected function videoUrl(): Attribute
    {
        return Attribute::make(
            get: fn(string | null $video_url) => $video_url ? url("/") . "/storage/uploads/videos" . "/$video_url" : null
        );
    }

    public function toSitemapTag(): Url | string | array
    {

        return Url::create(route('show.news', ["slug" => $this->slug, "type" => "articles"]))
            ->setLastModificationDate(Carbon::create($this->updated_at))
            ->setChangeFrequency(Url::CHANGE_FREQUENCY_YEARLY)
            ->setPriority(0.1)
            ->addImage($this->image->name, "{$this->title}");
    }

    public function toFeedItem(): FeedItem
    {
        $route = route("show.news", ["slug" => $this->slug, "type" => "articles"]);

        return FeedItem::create([
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'summary' => $this->meta_desc ?? strip_tags($this->description),
            'description' => $this->meta_desc ?? strip_tags($this->description),
            'updated' => $this->updated_at,
            'link' => $route,
            'image' => $this->image->name,
            'authorName' => @$this->author->name ?? "Tembah",
            'authorEmail' => @$this->author->email ?? "info@tembah.net",
        ]);
    }

    protected function createdAt(): Attribute
    {
        return new  Attribute(
            get: fn($created_at) => Carbon::parse($created_at)->diffForHumans(short: true),
        );
    }

    public function author()
    {
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
     * Get the news categories.
     */
    public function players(): \Staudenmeir\EloquentJsonRelations\Relations\BelongsToJson
    {
        return $this->belongsToJson(Player::class, 'options->player_ids');
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

    public function image(): MorphOne
    {
        return $this->morphOne(Image::class, "imageable");
    }
    
}
