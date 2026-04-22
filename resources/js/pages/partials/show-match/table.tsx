import LeagueTable from '@/components/league-table';
import Loader from '@/components/loader';
import useLeagueStore from '@/stores/use-league-store';
import { SharedData } from '@/types';
import { Fixture } from '@/types/match';
import { usePage } from '@inertiajs/react';
import { PropsWithChildren, useEffect } from 'react';
import Ad from '../ad';

export default function Table({ leagueData, match }: PropsWithChildren<Fixture>) {
    const { leagues, loading, initLeague, updateLeagueData } = useLeagueStore();
    const { leagueId } = leagueData;
    const currentSeason = usePage<SharedData>().props.currentSeason;

    useEffect(() => {
        if (leagueId) {
            initLeague(leagueId);
            getPageData();
        }
    }, []);

    const getPageData = async () => updateLeagueData(leagueId, currentSeason);

    return (
        <>
            <Ad />
            {!loading && leagues[leagueId]?.standings?.length ? (
                <LeagueTable
                    table={leagues[leagueId].standings}
                    showFilter={false}
                    teamsInView={[match.homeTeam.teamId.toString(), match.awayTeam.teamId.toString()]}
                    league={leagueId}
                />
            ) : loading ? (
                <Loader />
            ) : (
                <>
                    <div className="flex w-full items-center justify-center p-3">
                        <p className="text-lg font-bold">No standings to show.</p>
                    </div>
                </>
            )}
        </>
    );
}
