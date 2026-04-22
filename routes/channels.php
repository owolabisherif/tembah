<?php

use App\Broadcasting\GamesChannel;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('games', GamesChannel::class);
