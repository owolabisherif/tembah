<?php

namespace App\Models;

use App\Enums\NewsType;
use Illuminate\Database\Eloquent\Model;

class TransferNews extends Model
{
    protected $guarded = [];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'options' => 'json',
            "type" => NewsType::class
        ];
    }

    public function seo() {
        return $this->morphOne(Seo::class, "seoable");
    }

    public function slider() {
        return $this->morphOne(Slider::class, "sliderable");
    }
}
