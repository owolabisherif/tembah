<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HistoricalFixture extends Model
{
    protected $casts = [
        "data" => "array"
    ];
}
