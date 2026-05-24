<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ArticleView extends Model
{
    protected $guarded = [];
    
    protected $table = 'article_views';


    public function article() {
        return $this->belongsTo(Article::class, "article_id");
    }
}
