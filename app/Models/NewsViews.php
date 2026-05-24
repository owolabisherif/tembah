<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NewsViews extends Model
{
    protected $guarded = [];


    public function news() {
        return $this->belongsTo(News::class, "news_id");
    }
}
