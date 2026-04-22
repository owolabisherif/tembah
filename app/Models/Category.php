<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class Category extends Model
{
    protected $guarded = [];
    
    use \Staudenmeir\EloquentJsonRelations\HasJsonRelationships;

    public function news(): \Staudenmeir\EloquentJsonRelations\Relations\HasManyJson
    {
        return $this->hasManyJson(News::class, 'options->category_ids');
    }

    /**
     * Get the category seo.
    */
    public function seo(): MorphOne
    {
        return $this->morphOne(Seo::class, 'seoable');
    }

    public function image(): MorphOne
    {
        return $this->morphOne(Image::class, "imageable");
    }
}
