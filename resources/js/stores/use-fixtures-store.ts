import { usePlaceholderImage } from "@/hooks/user-placeholder-image"
import { SelectItems, SharedData } from "@/types"
import { FixtureMatch, Fixtures, MatchCardProp, Standing, StatResponse, TransferType } from "@/types/match"
import { isDate, isToday, isTomorrow, isYesterday, format } from "date-fns";
import axios from "axios"
import {create} from "zustand"

interface LeagueFixture {
   fixtures: Fixtures[],
   leagues: SelectItems[],
   matches: FixtureMatch[],
   loading: boolean,
   initFixtures: () => void
   refreshFixtures: () => void
   getFilteredMatches: (fixtureId: number) => FixtureMatch[],
   getFilteredMatchesByDate: (key: string | null) => Promise<FixtureMatch[]>,
   getLiveFixtures: () => FixtureMatch[]
}


const useFixtureStore = create<LeagueFixture>()((set, get) => ({
    fixtures: [],
    leagues: [],
    matches: [],
    loading: false,
    initFixtures: async () => {
        try {
            set({loading: true})
            let storedFixtures = get().fixtures;

            let leagues: SelectItems[] = []
            let matches: FixtureMatch[] = []

            const fixtureList = storedFixtures.length ? storedFixtures : await handleFixtures(null);

            if(fixtureList.length) {
                for await (const fixture of fixtureList) {
                    leagues.push({
                        value: fixture.id,
                        label: fixture.league,
                        imageUrl: fixture.imageUrl ?? usePlaceholderImage()
                    })

                    matches = [...matches, ...fixture.matches.filter(item => item.awayTeam.teamId && item.homeTeam.teamId)]
                }
            }

            matches = matches.filter(item =>  !item.isLive)

            set({
                leagues,
                fixtures: [...fixtureList],
                matches,
                loading: false
            })
        } catch (error) {
            console.error(error)
        }
    },
    refreshFixtures: async () => {
        try {
            
            let leagues: SelectItems[] = []
            let matches: FixtureMatch[] = []
    
            const fixtureList = await handleFixtures(null);
    
            if(fixtureList.length) {
                for await (const fixture of fixtureList) {
                    leagues.push({
                        value: fixture.id,
                        label: fixture.league,
                        imageUrl: fixture.imageUrl ?? usePlaceholderImage()
                    })
    
                    matches = [...matches, ...fixture.matches.filter(item => item.awayTeam.teamId && item.homeTeam.teamId)]
                }
            }
    
    
            set({
                leagues,
                fixtures: fixtureList,
                matches,
            })
        } catch (error) {
            console.log(error)
        }
    },
    getFilteredMatches: (fixtureId: number): FixtureMatch[] => {
        if(!get().fixtures.length) return [];

        let matches = get().fixtures.find(item => item.id == fixtureId)?.matches;

        if(!matches?.length) return []

        return matches
    },
    getFilteredMatchesByDate: async (key: string | null): Promise<FixtureMatch[]> => {
        let leagues: SelectItems[] = []

        set({loading: true});

        let matches: FixtureMatch[] = []

        let fixtureList = await handleFixtures(key);

        if(fixtureList.length) {
            for await (const fixture of fixtureList) {
                leagues.push({
                    value: fixture.id,
                    label: fixture.league,
                    imageUrl: fixture.imageUrl ?? usePlaceholderImage()
                })

                matches = [...matches, ...fixture.matches.filter(item => item.awayTeam.teamId && item.homeTeam.teamId)]
            }
        }

        if(!matches) return []
        
        set({
            leagues,
            matches: matches,
            fixtures: fixtureList,
            loading: false
        })

        return matches
    },
    getLiveFixtures:  (): FixtureMatch[] =>  {
        const fixtures = get().fixtures
        
        let gameStatus: string[] = ['pen.', 'ft', 'aet', 'wo', 'postp.', 'aban.', 'cancl.', 'susp.', 'int.', 'delayed', 'awarded', 'not started'];

        if(!fixtures.length) return [];
        let liveGames: FixtureMatch[] = [];

        for (const game of fixtures) {
            for(const match of game.matches) {
                if(match.isLive) {
                    liveGames = [...liveGames, match]
                }
            }
        }

        return liveGames
    }
}))


const handleFixtures = async (key: any | null ): Promise<Fixtures[]> => {
    try {
      
        const res = key  ? await axios.get<Fixtures[]>(route('soccer.fixtures', {period: key})) : await axios.get<Fixtures[]>(route('soccer.fixtures'));

        return res.data;
    } catch (error) {
        console.error(error)
        throw new Error("An error occured.")
    }
}



export default useFixtureStore