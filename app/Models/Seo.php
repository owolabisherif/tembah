<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Seo extends Model
{
    protected $guarded = [];

    /**
     * Get the parent seoable model (user or post).
     */
    public function seoable(): MorphTo
    {
        return $this->morphTo();
    }
}
