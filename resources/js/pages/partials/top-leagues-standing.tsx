import HomeStanding from '@/components/home-standing';
import { League, Standing } from '@/types/match';
import axios from 'axios';
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from 'lucide-react';
import { AnimatePresence, motion, usePresenceData, wrap } from 'motion/react';
import { useEffect, useState } from 'react';

type TopLeagueStandingType = {
    league: League;
    standings: Standing[];
};

export default function TopLeaguesStanding() {
    const [loading, setLoading] = useState(false);
    const [standings, setStandings] = useState<TopLeagueStandingType[]>([]);
    const [selectedItem, setSelectedItem] = useState<TopLeagueStandingType | null>(null);
    const [direction, setDirection] = useState<1 | -1>(1);

    useEffect(() => {
        getFixtures();
    }, []);

    const setSlide = (newDirection: 1 | -1) => {
        if (!selectedItem) return;

        let selectedItemIndex = standings.findIndex((item) => item.league.leagueId == selectedItem.league.leagueId);

        const nextItem = wrap(1, standings.length, selectedItemIndex + newDirection);
        setSelectedItem(standings[nextItem]);
        setDirection(newDirection);
    };

    const handleGetTopLeagues = async () => {
        const res = await axios.get<League[]>(route('top.leagues'));
        return res.data;
    };

    const getFixtures = async () => {
        try {
            let data: TopLeagueStandingType[] = [];
            setLoading(true);
            const leagues = await handleGetTopLeagues();

            if (leagues.length) {
                for (const league of leagues) {
                    const standings = await axios.get<Standing[]>(route('league.standings', { league: league.leagueId }));

                    if (standings.data.length) {
                        data = [...data, { league: league, standings: standings.data }];
                    }
                }
            }

            if (data.length) setSelectedItem(data[0]);

            setStandings(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const dire = usePresenceData();

    return (
        <>
            {loading ? (
                <div className="h-full w-full animate-pulse rounded-sm bg-gray-200"></div>
            ) : (
                <div className="mb-5 h-full w-full overflow-y-auto rounded-sm p-2 shadow-md md:mb-0">
                    <div className="flex w-full justify-between">
                        <motion.button
                            initial={false}
                            aria-label="Previous"
                            onClick={() => setSlide(-1)}
                            whileFocus={{ outline: `2px solid` }}
                            whileTap={{ scale: 0.9 }}
                            className="cursor-pointer"
                        >
                            <ArrowLeftCircleIcon className="w-10" />
                        </motion.button>
                        <motion.button
                            initial={false}
                            aria-label="Next"
                            onClick={() => setSlide(1)}
                            whileFocus={{ outline: `2px solid` }}
                            whileTap={{ scale: 0.9 }}
                            className="cursor-pointer"
                        >
                            <ArrowRightCircleIcon className="w-10" />
                        </motion.button>
                    </div>
                    <AnimatePresence custom={dire} initial={false} mode="popLayout">
                        <motion.div
                            initial={{ opacity: 0, x: dire * 50 }}
                            animate={{
                                opacity: 1,
                                x: 0,
                                transition: {
                                    delay: 0.2,
                                    type: 'spring',
                                    visualDuration: 0.3,
                                    bounce: 0.4,
                                },
                            }}
                            exit={{ opacity: 0, x: dire * -50 }}
                        >
                            {selectedItem && <HomeStanding league={selectedItem.league} standings={selectedItem.standings} />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            )}
        </>
    );
}
