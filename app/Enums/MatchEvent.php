<?php

namespace App\Enums;


enum MatchEvent: string {
    case Goal = 'goal';
    case RedCard = 'redcard';
    case YellowCard = 'yellowcard';
    case YellowRed = 'yellowred';
    case Unknown = 'none';
}