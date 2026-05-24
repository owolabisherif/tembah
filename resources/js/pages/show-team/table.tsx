import LeagueTable from '@/components/league-table';
import Loader from '@/components/loader';
import useLeagueStore from '@/stores/use-league-store';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { PropsWithChildren, useEffect } from 'react';
import { ShowTeamProp } from '.';
import Ad from '../partials/ad';

export default function Table({ team, league, ...props }: PropsWithChildren<ShowTeamProp>) {
    const { leagues, loading, initLeague, updateLeagueData } = useLeagueStore();
    const currentSeason = usePage<SharedData>().props.currentSeason;

    useEffect(() => {
        if (team) {
            initLeague(league ?? team.leagues?.league_id[0] ?? 0);
            getPageData();
        }
    }, []);

    const getPageData = async () => updateLeagueData(league ?? team.leagues?.league_id[0] ?? 0, currentSeason);

    return (
        <>
            <Ad />
            {!loading && team && leagues[league ?? team.leagues?.league_id[0] ?? 0]?.standings?.length ? (
                <LeagueTable
                    table={leagues[league ?? team.leagues?.league_id[0] ?? 0].standings!}
                    showFilter={true}
                    teamsInView={[team.teamId.toString()]}
                    className="mt-5"
                    league={league ?? null}
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
