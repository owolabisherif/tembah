<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class Article extends Model
{
    protected $guarded = [];

    protected $casts = [
        "options" => "json"
    ];
    
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
