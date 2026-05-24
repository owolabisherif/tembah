import EmberSlide from '@/components/embla-slide';
import EmblaSlider from '@/components/embla-slider';
import Loader from '@/components/loader';
import useDataPagination from '@/hooks/use-data-pagination';
import useLeagueStore from '@/stores/use-league-store';
import { SharedData } from '@/types';
import { FixtureMatch, League } from '@/types/match';
import { usePage } from '@inertiajs/react';
import { PropsWithChildren, useEffect, useState } from 'react';
import Ad from '../ad';

export default function Matches({ ...props }: PropsWithChildren<League>) {
    const { id, leagueId, season } = props;
    const { leagues, loading, initLeague, updateLeagueData } = useLeagueStore();
    const currentSeason = usePage<SharedData>().props.currentSeason;
    const [initialSlideIndex, setInitialSlideIndex] = useState(0);
    const [matches, setMatches] = useState<FixtureMatch[][][]>([]);

    useEffect(() => {
        if (leagueId) {
            initLeague(leagueId);
            getPageData();
        }
    }, [season]);

    const getPageData = async () => updateLeagueData(leagueId, currentSeason, season);

    useEffect(() => {
        const games = leagues[leagueId]?.fixtures?.matches;
        if (!games?.length) return;

        const pagination = useDataPagination(games, 3);

        setMatches(pagination);

        const nextGame = games.find((item) => item.isNext == true);

        if (nextGame) {
            for (let i = 0; i < pagination.length; i++) {
                for (const games of pagination[i]) {
                    const nextDate = games[0].date;
                    if (nextDate == nextGame.date) setInitialSlideIndex(i);
                }
            }
        }
    }, [leagues[leagueId]?.fixtures?.matches]);

    return (
        <div className="">
            <Ad />
            {!loading && matches.length ? (
                <EmblaSlider
                    scrollTo={initialSlideIndex}
                    slide={<EmberSlide matches={matches} />}
                    league={leagueId}
                    style="rounded-sm border-2 border-gray-100 shadow-xs h-max"
                />
            ) : loading ? (
                <Loader />
            ) : (
                <>
                    {/* <div className="flex w-full items-center justify-center p-3">
                            <p className="text-lg font-bold">No standings to show.</p>
                        </div> */}
                </>
            )}
        </div>
    );
}
