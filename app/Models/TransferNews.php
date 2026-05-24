<?php

namespace App\Models;

use App\Enums\NewsType;
use App\Traits\ImageRelationship;
use Illuminate\Database\Eloquent\Model;

class TransferNews extends Model
{
    use ImageRelationship, \Staudenmeir\EloquentJsonRelations\HasJsonRelationships;

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
     * Get the news players.
     */
    public function players(): \Staudenmeir\EloquentJsonRelations\Relations\BelongsToJson
    {
        return $this->belongsToJson(Player::class, 'options->player_ids');
    }

    public function seo() {
        return $this->morphOne(Seo::class, "seoable");
    }

    public function slider() {
        return $this->morphOne(Slider::class, "sliderable");
    }
}
