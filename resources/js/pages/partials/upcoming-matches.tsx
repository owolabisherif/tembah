import MatchCard from '@/components/match-card';
import MatchCardLoader from '@/components/match-card-loader';
import SelectOption from '@/components/select-option';
import SelectValue from '@/components/select-value';
import SlickSlider from '@/components/slick-slider';
import ViewAllButton from '@/components/ui/view-all-button';
import { useIsMobile } from '@/hooks/use-mobile';
import useFixtureStore from '@/stores/use-fixtures-store';
import { SharedData } from '@/types';
import { FixtureMatch } from '@/types/match';
import { usePage, usePoll } from '@inertiajs/react';
import { t } from 'i18next';
// import { startOfMonth } from 'date-fns';
import { useEffect, useState } from 'react';
// import DatePicker from 'react-datepicker';
import Select from 'react-select';

export default function UpcomingMatches() {
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [period, setPeriod] = useState<String>('home');
    const { loading, leagues, matches, fixtures, initFixtures, getFilteredMatches, getFilteredMatchesByDate, refreshFixtures, getLiveFixtures } =
        useFixtureStore();
    const [games, setGames] = useState<FixtureMatch[]>([]);

    const isMobile = useIsMobile();

    const periodList = usePage<SharedData>().props.periods;

    // const periods = useRef([
    //     {
    //         value: 'home',
    //         label: t('Today'),
    //     },
    //     {
    //         value: 'd-1',
    //         label: t('Yesterday'),
    //     },
    //     {
    //         value: 'd1',
    //         label: t('Tomorrow'),
    //     },
    //     {
    //         value: 'live',
    //         label: 'Live',
    //     },
    // ]);

    useEffect(() => {
        if (periodList.length) {
            for (const item of periodList) {
            }
        }
    }, [periodList]);

    const { start, stop } = usePoll(
        60000,
        {
            onStart() {
                refreshFixtures();
            },
            onFinish() {},
        },
        { autoStart: false },
    );

    useEffect(() => {
        initializeFixture();
    }, []);

    const initializeFixture = async () => {
        initFixtures();
    };

    useEffect(() => {
        if (leagues.length) handleGetGames(0);
        if (!matches.length) {
            start();
        } else {
            stop();
        }

        return () => {
            stop();
        };
    }, [matches]);

    const handleGetGamesByDate = async (key: string) => {
        const gameList = key === 'live' ? getLiveFixtures() : await getFilteredMatchesByDate(key);

        if (!gameList.length) {
            setGames(matches);
            return;
        }

        setGames(gameList);
    };

    const loaders = Array.from({ length: isMobile ? 1 : 4 });

    const handleGetGames = (fixtureId: number) => {
        const gameList = fixtureId == 0 ? matches : getFilteredMatches(fixtureId);

        setGames(gameList);
    };

    const handleChange = (league: any) => {
        if (!league) {
            handleGetGames(0);
            return;
        }

        handleGetGames(+league.value);
    };

    const handlePeriod = (period: any) => {
        // if (period.value == 'live') {
        //     start();
        // } else {
        //     stop();
        // }
        setPeriod(period.value);
        handleGetGamesByDate(period.value);
    };

    return (
        <div className="my-5">
            <>
                {Boolean(matches.length) && (
                    <div>
                        <div className="mb-3 flex items-center justify-between">
                            <h1 className="text-lg font-bold text-black dark:text-white">{t('Upcoming Matches')}</h1>
                            <ViewAllButton href={route('soccer.matches', { period: period })} />
                        </div>
                        <div className="relative z-[1000] mb-2">
                            <div className="flex items-center gap-x-5">
                                <div className="flex-1 md:w-64 md:flex-none">
                                    <Select
                                        openMenuOnClick={false}
                                        placeholder={t('Filter fixtures...')}
                                        onChange={handleChange}
                                        isSearchable={false}
                                        isClearable={true}
                                        isMulti={false}
                                        options={leagues}
                                        components={{ Option: SelectOption, SingleValue: SelectValue }}
                                        classNames={{
                                            control: (state) =>
                                                '!rounded-full !focus:ring-0 !active:ring-0 !border-gray-300 !w-full !focus:outline-none !active:outline-none !focus:border-0 !dark:bg-neutral-800',
                                        }}
                                    />
                                </div>
                                <div className="flex-1 md:w-64 md:flex-none">
                                    {/* <DatePicker
                                        selected={selectedDate}
                                        onChange={setSelectedDate}
                                        minDate={startOfMonth(new Date())}
                                        customInput={
                                            <DateInput className="flex items-center gap-x-2 rounded-full border border-gray-300 px-3 py-2" />
                                        }
                                    /> */}
                                    <Select
                                        openMenuOnClick={false}
                                        defaultValue={periodList.length ? periodList?.find((item) => item.value == 'home') : []}
                                        onChange={handlePeriod}
                                        isSearchable={false}
                                        isMulti={false}
                                        options={periodList}
                                        classNames={{
                                            control: (state) =>
                                                '!rounded-full !focus:ring-0 !active:ring-0 !border-gray-300 !w-full  !focus:outline-none !active:outline-none !focus:border-0',
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </>

            {loading ? (
                <div className="my-3 grid grid-cols-12 gap-x-2">
                    {loaders.map((item, index) => (
                        <div className={isMobile ? 'col-span-12' : 'col-span-3'} key={index}>
                            <MatchCardLoader />
                        </div>
                    ))}
                </div>
            ) : matches.length && !loading ? (
                <div className="">
                    <SlickSlider showArrow={!isMobile && true} autoplay={false} initialSlide={0}>
                        {games.map((item) => (
                            <MatchCard {...item} key={item.id} />
                        ))}
                    </SlickSlider>
                </div>
            ) : (
                <div></div>
            )}
        </div>
    );
}
