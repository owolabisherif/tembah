<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    public $guarded = [];



    public function leagues()
    {
        return $this->hasMany(League::class);
    }
}
