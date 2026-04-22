<?php

namespace App\Models;

use App\Traits\Slugify;
use Illuminate\Database\Eloquent\Model;

class League extends Model
{
    use Slugify;

    public $guarded = [];


    public function country()
    {
        return $this->belongsTo(Country::class);
    }


    /**
     * Get the options for generating the slug.
     */
    public function getSlugOptions(): array
    {
        return [
            "column" => ["name", "name_ar"],
            "saveTo" => ["slug", "slug_ar"],
            "lang" => ["en", "ar"],
        ];
    }
}
