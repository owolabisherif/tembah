<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeagueFixture extends Model
{
    protected $casts = [
        "match" => "array",
    ];
}
