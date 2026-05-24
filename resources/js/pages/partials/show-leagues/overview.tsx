import LeagueTable from '@/components/league-table';
import Loader from '@/components/loader';
import StatCard from '@/components/stat-card';
import { useIsMobile } from '@/hooks/use-mobile';
import useStandingStore from '@/stores/use-league-store';
import { SharedData } from '@/types';
import { FixtureMatch, League } from '@/types/match';
import { Link, usePage } from '@inertiajs/react';
import { t } from 'i18next';
import { PropsWithChildren, useEffect, useState } from 'react';
import Ad from '../ad';
import MatchSlider from '../match-slider';

type FixtureType = {
    id: number;
    week: number;
    season: string;
    matches: FixtureMatch[];
};

export default function Overview({ ...props }: PropsWithChildren<League>) {
    const { id, slug, leagueId, season } = props;
    const [initialSlideIndex, setInitialSlideIndex] = useState(0);
    const currentSeason = usePage<SharedData>().props.currentSeason;
    const { leagues, loading, initLeague, updateLeagueData } = useStandingStore();
    const isMobile = useIsMobile();

    useEffect(() => {
        if (leagueId) {
            history.pushState({}, '', `${route('index.league', { slug: slug })}?tab=overview`);
        }
    }, [leagueId]);

    // const getPageData = async () => updateLeagueData(leagueId, currentSeason, season);

    useEffect(() => {
        if (!leagues[leagueId]?.fixtures?.matches.length) return;

        const nextGamesIndex = leagues[leagueId]?.fixtures?.matches.findIndex((item) => item.isNext == true);

        setInitialSlideIndex(nextGamesIndex);
    }, [leagues[leagueId]?.fixtures?.matches]);

    return (
        <>
            {!loading && leagues[leagueId]?.fixtures?.matches?.length ? (
                <>
                    <div className="mb-5 w-full rounded-sm p-3 shadow-sm">
                        {leagues[leagueId]?.fixtures?.matches.length ? (
                            <div className="flex justify-between">
                                <h3 className="mb-3 font-extrabold">{t('Matches')}</h3>
                                <Link href={`${route('index.league', { slug })}?tab=${'fixtures'}`} className="mb-3 font-extrabold text-red-500">
                                    {t('All matches')}
                                </Link>
                            </div>
                        ) : (
                            <div></div>
                        )}

                        <MatchSlider
                            autoplay={false}
                            showArrow={!isMobile && true}
                            matches={leagues[leagueId]?.fixtures?.matches ?? []}
                            initialSlide={initialSlideIndex}
                        />
                    </div>
                </>
            ) : (
                <Loader />
            )}
            <Ad />
            {!loading && leagues[leagueId]?.standings?.length ? (
                <LeagueTable table={leagues[leagueId].standings} showFilter={false} league={leagueId} className="mt-5" />
            ) : (
                <></>
            )}
            {!loading && leagues[leagueId]?.stats && Object.entries(leagues[leagueId]?.stats).length ? (
                <div className="mt-5 grid grid-cols-12 gap-y-5 md:gap-x-5">
                    <div className="col-span-12 md:col-span-4">
                        {leagues[leagueId].stats.goals.length ? (
                            <StatCard title={t('Top scorer')} payload={leagues[leagueId].stats.goals.slice(0, 3)} leagueId={leagueId} />
                        ) : (
                            ''
                        )}
                    </div>
                    <div className="col-span-12 md:col-span-4">
                        {leagues[leagueId].stats.assists.length ? (
                            <StatCard title={t('Assists')} payload={leagues[leagueId].stats.assists.slice(0, 3)} leagueId={leagueId} />
                        ) : (
                            ''
                        )}
                    </div>
                    <div className="col-span-12 md:col-span-4">
                        {leagues[leagueId].stats.goalsPlusAssists.length ? (
                            <StatCard
                                title={t('Goals + Assists')}
                                payload={leagues[leagueId].stats.goalsPlusAssists.slice(0, 3)}
                                leagueId={leagueId}
                            />
                        ) : (
                            ''
                        )}
                    </div>
                </div>
            ) : (
                <></>
            )}
        </>
    );
}
