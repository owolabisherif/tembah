<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Slider extends Model
{
    protected $guarded = [];

    /**
     * Get the parent sliderable model (user or post).
     */
    public function sliderable(): MorphTo
    {
        return $this->morphTo();
    }
}
