import MatchCard from '@/components/match-card';
import ViewAllButton from '@/components/ui/view-all-button';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import useFixtureStore from '@/stores/use-fixtures-store';
import { FixtureMatch, Fixtures } from '@/types/match';
import { usePoll } from '@inertiajs/react';
import axios from 'axios';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import Ad from './ad';
import TopLeagues from './top-leagues';

export default function LiveMatch() {
    const [matches, setMatches] = useState<FixtureMatch[]>([]);
    const { getLiveFixtures } = useFixtureStore();
    const isMobile = useIsMobile();

    const { start, stop } = usePoll(
        60000,
        {
            onStart() {
                refreshLiveGames();
            },
            onFinish() {
                console.log('finish');
            },
        },
        { autoStart: false },
    );

    useEffect(() => {
        refreshLiveGames();
        start();

        return () => {
            stop();
        };
    }, []);

    useEffect(() => {
        if (isMobile) stop();
    }, [isMobile]);

    const refreshLiveGames = async () => {
        try {
            let matchList: FixtureMatch[] = [];

            const fixtureList = await handleFixtures();

            if (fixtureList.length) {
                for (const fixture of fixtureList) {
                    matchList = [...matchList, ...fixture.matches.filter((item) => item.awayTeam.teamId && item.homeTeam.teamId)];
                }
            }

            matchList = matchList.length ? matchList : getLiveFixtures();

            setMatches(matchList);
        } catch (error) {
            console.error(error);
        }
    };

    const handleFixtures = async (): Promise<Fixtures[]> => {
        try {
            const res = await axios.get<Fixtures[]>(route('live.games'));

            return res.data;
        } catch (error) {
            throw new Error('An error occured.');
        }
    };
    return (
        <>
            <div className="flex h-full flex-col gap-y-5 rounded-sm">
                <div className="flex flex-1 flex-col rounded-sm px-1">
                    <div className="mb-5 flex items-center justify-between">
                        <div className="flex flex-1 items-center justify-start gap-x-3">
                            <div className={cn('h-4 w-8')}>
                                <img src="/assets/icons/live.png" className="h-full w-full object-contain" alt="" />
                            </div>
                            <h1 className="m-0 p-0 text-lg font-bold text-black">{t('Live Scores')}</h1>
                        </div>
                        <ViewAllButton href={route('live.scores')} />
                    </div>
                    <div className="flex flex-1 flex-col gap-y-2 overflow-hidden">
                        <div className="scrollbar h-[30rem] overflow-x-hidden overflow-y-auto">
                            {Boolean(matches.length) ? (
                                matches.map((match) => (
                                    <div key={match.id} className="mb-3">
                                        <MatchCard {...match} />
                                    </div>
                                ))
                            ) : (
                                <div className="flex h-full flex-col gap-y-2">
                                    <div className="flex h-fit animate-pulse items-center justify-center rounded-sm bg-green-400 p-5 shadow-sm dark:bg-neutral-400">
                                        <p className="font-bold text-white">{t('Checking for live matches...')}</p>
                                    </div>
                                    <div className="b-red-500 h-full w-full flex-1 rounded-sm bg-gray-300">
                                        <Ad type="ver" />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 overflow-y-auto rounded-sm bg-gray-50 p-2">
                            <TopLeagues />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
