import { SharedData } from "@/types"
import { MatchCardProp, Standing, StatResponse, TransferType } from "@/types/match"
import axios from "axios"
import {create} from "zustand"

interface TeamStoreType {
   teams: TeamType,
   loading: boolean,
   hideTable: boolean
   hideTransfer: boolean,
   hideStat: boolean,
   hideNews: boolean,
   refreshTimer: number,
   updateTeamData: (teamId: number, currentSeason: string, season?: string) => void,
   updateStatData: (teamId: number, currentSeason: string, season?: string) => void,
   updateTransferData: (teamId: number) => void,
   initTeam: (teamId: number) => void,
   resetTeam: (teamId: number) => void,
   updateTimer: () => void,
   reset: () => void
}

type TeamType = {
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
    matches: MatchCardProp[];
};



const useTeamStore = create<TeamStoreType>()((set, get) => ({
    teams: [],
    loading: false,
    hideTable: false,
    hideTransfer: false,
    hideStat: false,
    hideNews: false,
    refreshTimer: 1,
    initTeam: (teamId: number) => {
        let teams: TeamType = get().teams

        if(!Object.keys(teams).includes(teamId.toString())) {
            teams[teamId] = {}
            set(() => ({teams: teams}))
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
    updateTeamData: async (teamId: number,currentSeason: string, season?: string) => {
        try {
            let teams: TeamType = get().teams
            let hasFixtures = teams[teamId].fixtures && Object.entries(teams[teamId].fixtures).length  > 0
            let hasStandings = teams[teamId].standings && teams[teamId].standings.length > 0
            let hasStats = teams[teamId].stats && Object.entries(teams[teamId].stats).length

            if(!hasStandings) set(() => ({hideTable: true}))


            if(hasFixtures || hasStandings || hasStats) {
                set(() => ({loading: false, hideTable: teams[teamId].standings?.length ? false : true, hideStat:  hideStatTab(teams[teamId].stats!)}))
                return
            }
            set(() => ({loading: true}))
            const stds = season
                ? await axios.get<Standing[]>(route('team.standings', { team: teamId, season: season }))
                : await axios.get<Standing[]>(route('team.standings', { team: teamId }));
    
            const fixtures =
                    season && season != currentSeason
                        ? await axios.get<FixtureType>(route('team.history.fixtures', { team: teamId, season: season }))
                        : await axios.get<FixtureType>(route('team.fixtures', { teamId: teamId }));

             const teamStats = await axios.get<StatResponse>(route('team.statistics', { team: teamId, season: season ?? currentSeason }));
                
            const [fixturesRes, stdsRes, teamStatsRes] = await Promise.all([fixtures, stds, teamStats]);
            
            teams[teamId]["fixtures"] = fixturesRes.data
            teams[teamId]["standings"] = stdsRes.data
            teams[teamId]["stats"] = teamStatsRes.data
                        
            set(() => ({teams: teams, loading: false, hideTable: stdsRes.data.length ? false : true, hideStat: hideStatTab(teamStatsRes.data)}))
        } catch (error) {
            console.error(error)
            set(() => ({loading: true}))
        }
    },
    updateStatData: async (teamId: number,currentSeason: string, season?: string) => {
        try {
            // let teams: TeamType = get().teams

            // if(teams[teamId].stats && Object.entries(teams[teamId]!.stats).length) {
            //     set(() => ({loading: false}))
            //     return
            // }

            // set(() => ({loading: true}))

            // const res = await axios.get<StatResponse>(route('team.statistics', { team: teamId, season: season ?? currentSeason }));
            
            // teams[teamId]["stats"] = res.data
        
                        
            // set(() => ({teams: teams, loading: false}))

        } catch (error) {
            console.error(error)
            set(() => ({loading: true}))
        }
    },
    updateTransferData: async (teamId: number) => {
        try {
            let teams: TeamType = get().teams

            if(teams[teamId].transfers && teams[teamId].transfers.length) {
                set(() => ({loading: false, hideTransfer: teams[teamId].transfers!.length ? false : true}))
                return
            }

            set(() => ({loading: true}))

            const res = await axios.get<TransferType[]>(route('teams.team.transfers', { team: teamId }));
            
            teams[teamId]["transfers"] = res.data
                
            set(() => ({teams: teams, loading: false, hideTransfer: res.data.length ? false : true}))

        } catch (error) {
            console.error(error)
            set(() => ({loading: false}))
        }
    },
    reset: ()=> set(() => ({teams: {}})), //implement update logic for props in teams state
    resetTeam: (teamId: number) => {
        let teams = get().teams;

        teams[teamId] = {}

        set(() => ({teams: teams}))
    }
}))



const hideStatTab = (stats: StatResponse): boolean => {
    if(stats.assists?.length || stats.goals?.length) return false

    return true;
}


export default useTeamStore