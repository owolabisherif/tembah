<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Fixture extends Model
{
    // public $timestamps = false;

    protected $casts = [
        "match" => "array",
    ];

    public function league() {
        return $this->belongsTo(League::class, "league_id");
    }
}
