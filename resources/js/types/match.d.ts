export interface MatchCardProp {
    id: number
    homeTeam: Team
    awayTeam: Team
    isNext: boolean
    sort: string
    attendance: string | null
    status: string
    date: string
    time: string
    venueCity: string;
    venue: string | null
}
                     
type Team = {
    name: string
    imageUrl?: string
    isHome?: boolean
    logo?: string
    etScore?: number
    ftScore?: number
    htScore?: number
    penScore?: number
    score?: number
    teamId?: number
    slug: string,
    hasRed?:boolean,
    hasYellow?:boolean,
    hasYellowRed?:boolean,
};

type ToFromType = {
    id: string,
    slug: string,
    name: string,
    image: string | null
}

interface TransferType  {
    id: string
    name: string
    slug: string
    image: string | null
    position: string
    age: string
    type: string
    price: string
    to: ToFromType
    from: ToFromType
    sort: number
    date: string
}



export interface TopLeague {
    id: number
    imageUrl: string
    name: string
}


export interface League  {
    id: number
    sort?: number
    leagueId: number
    slug: string
    slugAr: string
    name: string
    nameAr: string
    logo: string
    country?: Country
    season?: string
};

type Country = {
    id: number
    name: string
    nameAr: string
}

export interface AllLeague {
    id: number;
    slug: string;
    slugAr: string;
    name: string;
    nameAr: string;
    logo: string;
    sort: number;
    leagues: League[];
}



type StandingAwayHome =  {
    d: string
    ga:string
    gp:string
    gs:string
    l :string
    p:string
    w:string
    gd: string
}

type StandingOverall = {
    d: string
    ga: string
    gp: string
    gs: string
    l: string
    w: string
    p?:string
}

export interface Standing {
    id: number
    gid?: number
    name: string
    logo: string | null
    position: number
    recentForm: string
    status: string
    inChampions: boolean
    inEuropa: boolean
    inConference: boolean
    inRelegation: boolean
    away: StandingAwayHome
    home: StandingAwayHome
    overall: StandingOverall
    total: { gd: string, p: string }
}

type StatCardPayload = {
    player: {
        id: number;
        name: string;
        image: string;
    };
    team: {
        id: number;
        name: string;
        logo: string;
    };
    value: number;
}

export interface StatCardType {
    title: string;
    payload: StatCardPayload[];
};

export interface StatResponse {
    season: string;
    goals: StatCardPayload[];
    assists: StatCardPayload[];
    goalsPlusAssists: StatCardPayload[];
};


type FixtureTeam = {
    slug: string
    teamId: number
    logo: string
    name: string
    ftScore?: number
    htScore?: number,
    hasRed?:boolean,
    hasYellow?:boolean,
    hasYellowRed?:boolean,
}

type FixtureEvent = {
    id: number
    playerId: number
    type: string
    minute: string
    extraMinute: string
    team: string
    player: string
    result: string
    assist: string
    assistId: string
}


interface FixtureMatch extends Team {
    id: number
    sort: 0,
    // slug: string,
    staticId: number
    fixId: number
    commentaryId: number
    venueId: number
    status: string
    timer: string
    injuryTime: string
    injuryMinute: string
    date: string
    time: string
    isLive: boolean,
    venue: string
    venueCity: string
    isNext: boolean
    homeTeam: FixtureTeam
    awayTeam: FixtureTeam
    halfTimeScore: string
    fullTimeScore: string
    events: FixtureEvent[]
}

export interface Fixtures {
    id: number
    league: string
    leagueData: League
    coutry: string
    date: string
    sort: number
    imageUrl: null | string,
    matches: FixtureMatch[]
}

export interface Fixture {
    id: number
    league: string
    leagueData: League
    coutry: string
    date: string
    sort: number
    imageUrl: null | string,
    match: FixtureMatch
}


export type MatchPeriod = "live" | "today" | "tommorrow" | "yesterday"


export interface MatchOverviewType {
    id: number,
    staticId: number,
    status: string,
    time: string,
    timer: string,
    date: string,
    formattedDate: string,
    hasFormation: boolean,
    predictions: MatchPrediction | null
    homeTeam: MatchOverviewTeam,
    awayTeam: MatchOverviewTeam,
    commentaries: any[],
    matchInfo: {
        addedTimeFirst: string,
        addedTimeSecond: number
        attendance: 0
        ref: string
        stadium:string
    }

}

interface MatchPrediction {
    hasPrediction: boolean
    homeTeam: MatchPredictionTeam
    awayTeam: MatchPredictionTeam
}


interface MatchPredictionTeam extends MatchOverviewTeam {
    lineup: {
        formation: string,
        players: LineupPlayer[]
        positions: FormationType[]
    }
    colors: {
        player: {
            border: string,
            number: string,
            primary: string,
        },
        goalKeeper: {
            border: string,
            number: string,
            primary: string,
        },
    },
}


export type LineupPlayer = {
    id: number
    formationPos: string
    name: string
    image: string | null
    slug: string
    number: number
    position: string
}


export type Player = {
    id: number
    name: string
    number: number
    accCrosses: number
    accuratePasses: number
    aerialsWon: number
    assists: number
    bigChanceCreated: number
    bigChanceMissed: number
    blocks: number
    clearanceOffine: number
    clearances: number
    dispossesed: number
    dribbleAttempts: number
    dribbleSucc: number
    dribbledPast: number
    duelsTotal: number
    duelsWon: number
    errorLeadToGoal: number
    foulsCommitted: number
    foulsDrawn: number
    goals: number
    goalsConceded: number
    goodHighClaim: number
    hitWoodwork: number,
    interceptions: number
    isCaptain: false
    isSubst: false
    keyPasses: number
    lastmanTackle: number
    minusGoals: number
    minutesPlayed: number
    offsides: number
    passes: number
    penCommitted: number
    penMiss: number
    penSave: number
    penScore: number
    penWon: number
    position: string
    punches: number
    rating: string
    redCards: number
    saves: number
    savesInsideBox: number
    shotsOnGoal: number
    tackles: number
    totalCrosses: number
    totalShots: number
    yellowCards:number
}

type homeAway = 'home' | 'away';

export type FormationType = { id: string; x: number; y: number; team: homeAway; pos: number; player: LineupPlayer; isGoalKeeper: boolean, isCaptain: boolean }

interface MatchOverviewTeam {
    id: number,
    name: string,
    etScore: number,
    ftScore: number,
    goals:number,
    htScore: number,
    penScore: number,
    coach: {
        id: number,
        name: string
    },
    summary: {
        redCards: {
            id: number
            comment: string
            extraMinute: string
            minute: number
            name: string
        }[]
        yellowCards: {
            id: number
            comment: string
            extraMinute: string
            minute: number
            name: string
        }[]
        scorers: {
            id: number
            name: sting
            assistId: number
            assistName: string
            extraMin: string
            minute: string
            ownGoal: boolean
            penalty: boolean
            penaltyMissed: boolean
            varCancelled: boolean
        }[]
    }
    colors: {
        player: {
            border: string,
            number: string,
            primary: string,
        },
        goalKeeper: {
            border: string,
            number: string,
            primary: string,
        },
    },
    lineup: {
        formation: string,
        players: LineupPlayer[]
        positions: FormationType[]
    },
    substitutes: {
        id: number
        name: string
        number: number
        position: string
    }[]
    substitution: {
        injury: boolean
        minute: number
        off: string
        offId: number
        on: string
        onId: number
    }[]
    stats: {
        corners: {
            firstHalf: number
            secondHalf: number
            total: number
        },
        fouls: number
        goalPrevented: {
            firstHalf: number
            secondHalf: number
            total: number
        },
        offsides: {
            firstHalf: number
            secondHalf: number
            total: number
        },
        passes: {
            accurate: number
            total: number
            firstHalf: {
                accurate: number
                total: number
            },
            secondHalf: {
                accurate: number
                total: number
            }
        }
        possession: {
            firstHalf: string
            secondHalf: string
            total: string
        }
        redCards: {
            firstHalf: number
            secondHalf: number
            total: number
        }
        saves: {
            firstHalf: number
            secondHalf: number
            total: number
        }
        shots: {
            blocked: number
            insideBox: number
            offTarget: number
            onTarget: number
            outsideBox: number
            totalGoals: number
            firstHalf: {
                blocked: number
                goals: number
                insideBox: number
                offTarget: number
                onTarget: number
                outsideBox: number
            }
            secondHalf: {
                blocked: number
                goals: number
                insideBox: number
                offTarget: number
                onTarget: number
                outsideBox: number
            }
        }
        xGoals: {
            firstHalf: string
            secondHalf: string
            total: string
        }
        yellowCards: {
            firstHalf: number
            secondHalf: number
            total: number
        }
    },
    playerStats: Player[]
}

export type MainTeamPlayer = {
    id: number
    name: string
    image: string
    slug: string
    nationality: string
    height: string
    position: string
    countryFlag: string
    transferValue: string
    shirt: number
    age: number
}

export interface PlayerInformation {
    id: number
    playerId: number,
    teamId: number,
    nationalTeamId: number | null,
    slug: string,
    slugAr:string,
    name: string,
    nameAr: string,
    commonName: string,
    commonNameAr: string,
    fullname: string,
    fullnameAr: string,
    firstname: string,
    firstnameAr: string,
    lastname: string,
    lastnameAr: string,
    nationality: string,
    nationalityAr: string,
    birthCountry: string,
    birthCountryAr: string,
    birthCountryFlag: string | null,
    birthDate: string,
    birthDateAr: string,
    shirt: string,
    shirt_ar: string,
    preferredFoot: string,
    preferredFootAr: string,
    marketValue: string,
    birthPlace: string,
    birthPlaceAr: string,
    position: string,
    positionAr: string,
    age: number,
    ageAr: number,
    height: number,
    heightAr: number,
    weight: number,
    weightAr: number,
    image: string,
    team: string,
    teamAr: string,
    statistic: {
        leagueId: number,
        league: string
        season: string
        goals: number
        assist: number
        keyPasses: number
        matches: number
        minutesPlayed: number
        rating: number
        yellow: number
        red: number
    } | null,
    teamFlag: string | null,
    statisticCups: any,
    statisticCupsIntl: any,
    transfers: {
        year: string,
        price: string,
        type: string,
        from: {
            id: number,
            name: string,
            image: string,
        },
        to: {
            id: number,
            name: string,
            image: string,
        }
    }[],
    trophies: {
        count: number,
        league: string
        seasons: string[]
    }[],
    overallClubStats: {
        shots: number
        dribbles: number
        assist: number
        passes: number
        keyPasses: number
        matches: number
        minutesPlayed: number
        rating: number
        penScored: number
        tackles: number
    } | null,
    reload: number,
}

interface MainTeam {
    "id": number,
    "teamId": number,
    "countryId": number,
    "isWomen": boolean,
    "isNationalTeam": boolean,
    "slug": string,
    "slugAr": string,
    "name": string,
    "nameAr": string,
    "country": string,
    "countryAr": string,
    "fullname": string,
    "fullnameAr": string,
    "founded": string,
    "foundedAr": string,
    "leagues": {[key: string]},
    "venueName": string,
    "venueNameAr": string,
    "venueId": string,
    "venueSurface": string,
    "venueAddress": {[key: string]},
    "venueCity": {[key: string]},
    "venueCapacity": string,
    "venueCapacityAr": string,
    "venueImage": string,
    "image": string,
    "squad": MainTeamPlayer[],
    "coach": MainTeamPlayer | null,
    "transfers": {[key: string]},
    "statistics": {[key: string]},
    "detailedStats": {[key: string]},
    "sidelined": {[key: string]},
    "trophies": {[key: string]},
    "reload": string
}