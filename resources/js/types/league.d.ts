type Player = {
    id: number,
    name: string,
    imageUrl: string
}

type Club = {
    id: number,
    name: string,
    imageUrl: string
}


export interface Transfer  {
    id: number,
    fromClub: Club
    toClub: Club,
    player: Player,
    amount: string | null
    date: string
}