<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Team extends Model
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
            // 'leagues' => 'array',
            // 'venue_address' => 'array',
            // 'venue_city' => 'array',
            // 'squad' => 'array',
            // 'coach' => 'array',
            // 'transfers' => 'array',
            // 'statistics' => 'array',
            // 'detailed_stats' => 'array',
            // 'sidelined' => 'array',
            // 'trophies' => 'array',
        ];
    }

    public function country() {
        return $this->belongsTo(Country::class);
    }
}
