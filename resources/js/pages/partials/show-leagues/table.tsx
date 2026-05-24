import LeagueTable from '@/components/league-table';
import Loader from '@/components/loader';
import useLeagueStore from '@/stores/use-league-store';
import { SharedData } from '@/types';
import { League } from '@/types/match';
import { usePage } from '@inertiajs/react';
import { t } from 'i18next';
import { PropsWithChildren, useEffect } from 'react';
import Ad from '../ad';

export default function Table({ ...props }: PropsWithChildren<League>) {
    const { id, leagueId, season } = props;
    const { leagues, loading, initLeague, updateLeagueData } = useLeagueStore();
    const currentSeason = usePage<SharedData>().props.currentSeason;

    useEffect(() => {
        if (leagueId) {
            initLeague(leagueId);
            getPageData();
        }
    }, []);

    const getPageData = async () => updateLeagueData(leagueId, currentSeason, season);

    return (
        <>
            <Ad />
            {!loading && leagues[leagueId]?.standings?.length ? (
                <LeagueTable table={leagues[leagueId].standings} showFilter={true} league={leagueId} />
            ) : loading ? (
                <Loader />
            ) : (
                <>
                    <div className="flex w-full items-center justify-center p-3">
                        <p className="text-lg font-bold">{t('No standings to show.')}</p>
                    </div>
                </>
            )}
        </>
    );
}
