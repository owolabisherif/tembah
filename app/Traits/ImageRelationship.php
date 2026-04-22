<?php

namespace App\Traits;

use App\Models\Image;
use Illuminate\Database\Eloquent\Relations\MorphMany;

trait ImageRelationship
{
    public function images(): MorphMany {
        return static::morphMany(Image::class, "imageable");
    }
}
