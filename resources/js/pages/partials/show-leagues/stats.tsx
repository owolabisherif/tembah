import Loader from '@/components/loader';
import StatCard from '@/components/stat-card';
import useLeagueStore from '@/stores/use-league-store';
import { SharedData } from '@/types';
import { League, StatResponse } from '@/types/match';
import { usePage } from '@inertiajs/react';
import { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import Ad from '../ad';

export default function Stats({ ...props }: PropsWithChildren<League>) {
    const { id, leagueId, season } = props;
    const currentSeason = usePage<SharedData>().props.currentSeason;
    const [statistics, setStatistics] = useState<StatResponse>();
    const { leagues, loading, initLeague, updateStatData } = useLeagueStore();

    useEffect(() => {
        if (leagueId) {
            initLeague(leagueId);
        }
    }, [season]);

    const hasStats = useMemo(() => {
        if (!leagues[leagueId].stats) return false;

        return (
            leagues[leagueId].stats?.goals?.length > 0 &&
            leagues[leagueId]?.stats?.assists?.length > 0 &&
            leagues[leagueId].stats.goalsPlusAssists.length > 0
        );
    }, []);

    return (
        <>
            <h1 className="mb-5 text-xl font-bold">Top stats</h1>
            <Ad />
            {!loading && leagues[leagueId]?.stats && Object.entries(leagues[leagueId]?.stats).length && hasStats ? (
                <div className="grid grid-cols-12 gap-x-5">
                    <div className="col-span-4">
                        {leagues[leagueId].stats.goals.length ? (
                            <StatCard title="Top scorer" payload={leagues[leagueId].stats.goals.slice(0, 3)} />
                        ) : (
                            ''
                        )}
                    </div>
                    <div className="col-span-4">
                        {leagues[leagueId].stats.assists.length ? (
                            <StatCard title="Assists" payload={leagues[leagueId].stats.assists.slice(0, 3)} />
                        ) : (
                            ''
                        )}
                    </div>
                    <div className="col-span-4">
                        {leagues[leagueId].stats.goalsPlusAssists.length ? (
                            <StatCard title="Goals + Assists" payload={leagues[leagueId].stats.goalsPlusAssists.slice(0, 3)} />
                        ) : (
                            ''
                        )}
                    </div>
                </div>
            ) : loading ? (
                <Loader />
            ) : (
                <div className="flex w-full items-center justify-center p-3">
                    <p className="text-lg font-bold">No stats to show.</p>
                </div>
            )}
        </>
    );
}
