import { SharedData } from "@/types"
import { FixtureMatch, Standing, StatResponse, TransferType } from "@/types/match"
import axios from "axios"
import {create} from "zustand"

interface LeagueStoreType {
   leagues: LeagueType,
   loading: boolean,
   hideTable: boolean
   hideTransfer: boolean,
   hideStat: boolean,
   hideNews: boolean,
   refreshTimer: number,
   updateLeagueData: (leagueId: number, currentSeason: string, season?: string) => void,
   updateStatData: (leagueId: number, currentSeason: string, season?: string) => void,
   updateTransferData: (leagueId: number) => void,
   initLeague: (leagueId: number) => void,
   resetLeague: (leagueId: number) => void,
   updateTimer: () => void,
   reset: () => void
}

type LeagueType = {
    [key: number]: {
        standings?: Standing[],
        fixtures?: FixtureType,
        stats?: StatResponse,
        transfers?: TransferType[],
    }
}

type FixtureType = {
    id: number;
    week: number;
    season: string;
    matches: FixtureMatch[];
};



const useLeagueStore = create<LeagueStoreType>()((set, get) => ({
    leagues: [],
    loading: false,
    hideTable: false,
    hideTransfer: false,
    hideStat: false,
    hideNews: false,
    refreshTimer: 1,
    initLeague: (leagueId: number) => {
        let leagues: LeagueType = get().leagues

        if(!leagueId) return

        if(!Object.keys(leagues).includes(leagueId.toString())) {
            leagues[leagueId] = {}
            set(() => ({leagues: leagues}))
        }

    },
    updateTimer: () => {
        const currentTime = get().refreshTimer

        if(currentTime >= 180) {
            set(() => ({refreshTimer: 0}))
            return
        }

        set(() => ({refreshTimer: currentTime + 1}))
    },
    updateLeagueData: async (leagueId: number,currentSeason: string, season?: string) => {
        try {
            let leagues: LeagueType = get().leagues
            let hasFixtures = leagues[leagueId].fixtures && Object.entries(leagues[leagueId].fixtures).length  > 0
            let hasStandings = leagues[leagueId].standings && leagues[leagueId].standings.length > 0
            let hasStats = leagues[leagueId].stats && Object.entries(leagues[leagueId].stats).length

            if(!hasStandings) set(() => ({hideTable: true}))


            if(hasFixtures || hasStandings || hasStats) {
                set(() => ({loading: false, hideTable: leagues[leagueId].standings?.length ? false : true, hideStat:  hideStatTab(leagues[leagueId].stats!)}))
                return
            }
            set(() => ({loading: true}))
            const stds = season
                ? await axios.get<Standing[]>(route('league.standings', { league: leagueId, season: season }))
                : await axios.get<Standing[]>(route('league.standings', { league: leagueId }));
    
            const fixtures =
                    season && season != currentSeason
                        ? await axios.get<FixtureType>(route('league.history.fixtures', { league: leagueId, season: season }))
                        : await axios.get<FixtureType>(route('league.fixtures', { leagueId: leagueId }));

             const leagueStats = await axios.get<StatResponse>(route('league.statistics', { league: leagueId, season: season ?? currentSeason }));
                
            const [fixturesRes, stdsRes, leagueStatsRes] = await Promise.all([fixtures, stds, leagueStats]);
            
            leagues[leagueId]["fixtures"] = fixturesRes.data
            leagues[leagueId]["standings"] = stdsRes.data
            leagues[leagueId]["stats"] = leagueStatsRes.data
                        
            set(() => ({leagues: leagues, loading: false, hideTable: stdsRes.data.length ? false : true, hideStat: hideStatTab(leagueStatsRes.data)}))
        } catch (error) {
            console.error(error)
            set(() => ({loading: true}))
        }
    },
    updateStatData: async (leagueId: number,currentSeason: string, season?: string) => {
        try {
            // let leagues: LeagueType = get().leagues

            // if(leagues[leagueId].stats && Object.entries(leagues[leagueId]!.stats).length) {
            //     set(() => ({loading: false}))
            //     return
            // }

            // set(() => ({loading: true}))

            // const res = await axios.get<StatResponse>(route('league.statistics', { league: leagueId, season: season ?? currentSeason }));
            
            // leagues[leagueId]["stats"] = res.data
        
                        
            // set(() => ({leagues: leagues, loading: false}))

        } catch (error) {
            console.error(error)
            set(() => ({loading: true}))
        }
    },
    updateTransferData: async (leagueId: number) => {
        try {
            let leagues: LeagueType = get().leagues

            if(leagues[leagueId].transfers && leagues[leagueId].transfers.length) {
                set(() => ({loading: false, hideTransfer: leagues[leagueId].transfers!.length ? false : true}))
                return
            }

            set(() => ({loading: true}))

            const res = await axios.get<TransferType[]>(route('teams.league.transfers', { league: leagueId }));
            
            leagues[leagueId]["transfers"] = res.data
                
            set(() => ({leagues: leagues, loading: false, hideTransfer: res.data.length ? false : true}))

        } catch (error) {
            console.error(error)
            set(() => ({loading: false}))
        }
    },
    reset: ()=> set(() => ({leagues: {}})), //implement update logic for props in leagues state
    resetLeague: (leagueId: number) => {
        let leagues = get().leagues;

        leagues[leagueId] = {}

        set(() => ({leagues: leagues}))
    }
}))



const hideStatTab = (stats: StatResponse): boolean => {
    if(stats.assists?.length || stats.goals?.length) return false

    return true;
}


export default useLeagueStore