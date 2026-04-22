<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Head2Head extends Model
{
    protected $casts = [
        "h2h" => 'array',
    ];
}
