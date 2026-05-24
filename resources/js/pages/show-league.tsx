import { usePlaceholderImage } from '@/hooks/user-placeholder-image';
import GuestLayout from '@/layouts/guest-layout';
import { cn } from '@/lib/utils';
import useLeagueStore from '@/stores/use-league-store';
import { SharedData } from '@/types';
import { League } from '@/types/match';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { Deferred, Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import i18next, { t } from 'i18next';
import { ArrowLeftCircleIcon, Loader } from 'lucide-react';
import { JSX, useEffect, useRef, useState } from 'react';
import Matches from './partials/show-leagues/matches';
import News from './partials/show-leagues/news';
import Overview from './partials/show-leagues/overview';
import Stats from './partials/show-leagues/stats';
import Table from './partials/show-leagues/table';
import Transfers from './partials/show-leagues/transfers';

type TabType = 'overview' | 'table' | 'fixtures' | 'stats' | 'transfers' | 'seasons' | 'news';

type SeasonType = {
    id: number;
    leagueId: number;
    seasons: string[];
};

export default function ShowLeague(props: any) {
    const placeholderImage = '/assets/images/logo2.png';
    const league = props?.league as League;
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [seasons, setSeasons] = useState<SeasonType>();
    const [selectedSeason, setSelectedSeason] = useState<string>('');
    const {
        leagues,
        loading,
        hideTable,
        hideTransfer,
        hideNews,
        hideStat,
        refreshTimer,
        initLeague,
        updateLeagueData,
        resetLeague,
        updateTransferData,
        updateTimer,
    } = useLeagueStore();
    const currentSeason = usePage<SharedData>().props.currentSeason;
    const [types, setTypes] = useState<TabType[]>([]);
    const [panels, setPanels] = useState<JSX.Element[]>([]);
    const panelsMaster = [
        <Overview {...league} key="overview" />,
        <Table {...league} key="table" />,
        <Matches {...league} key="fixtures" />,
        <Stats {...league} key="stats" />,
        <Transfers {...league} key="transfers" />,
        // <Seasons {...league} key="seasons" />,
        <News {...league} key="news" />,
    ];
    const intervalId = useRef<any>(null);
    const [leagueLoading, setLeagueLoading] = useState(false);

    const typesMaster: TabType[] = ['overview', 'table', 'fixtures', 'stats', 'transfers', 'news']; //'seasons'

    useEffect(() => {
        setPanels(panelsMaster);
        setTypes(typesMaster);

        if (!league) return;

        initLeague(league.leagueId);

        updateLeagueData(league.leagueId, currentSeason, league.season);
        // updateStatData(league.leagueId, currentSeason, league.season);
        updateTransferData(league.leagueId);

        intervalId.current = setInterval(() => {
            updateTimer();
        }, 60000);

        return () => {
            clearInterval(intervalId.current);
        };
    }, [league]);

    useEffect(() => {
        const tableIndex = types.findIndex((item) => item == 'table');
        if (hideTable) {
            if (tableIndex != -1) {
                let newTypes = types.filter((item, index) => index != tableIndex);
                let newPanels = panels.filter((item, index) => index != tableIndex);
                setTypes(newTypes);
                setPanels(newPanels);
            }
        } else {
            if (!types.includes('table')) {
                resetTabs('table', <Table {...league} key="table" />);
            }
        }

        moveTab();
    }, [hideTable, panels, types, league]);

    useEffect(() => {
        const transferIndex = types.findIndex((item) => item == 'transfers');
        if (hideTransfer) {
            if (transferIndex != -1) {
                let newTypes = types.filter((item, index) => index != transferIndex);
                let newPanels = panels.filter((item, index) => index != transferIndex);
                setTypes(newTypes);
                setPanels(newPanels);
            }
        } else {
            if (!types.includes('transfers')) {
                resetTabs('transfers', <Transfers {...league} key="transfers" />);
            }
        }

        moveTab();
    }, [hideTransfer, panels, types]);

    useEffect(() => {
        const statIndex = types.findIndex((item) => item == 'stats');
        if (hideStat) {
            if (statIndex != -1) {
                let newTypes = types.filter((item, index) => index != statIndex);
                let newPanels = panels.filter((item, index) => index != statIndex);
                setTypes(newTypes);
                setPanels(newPanels);
            }
        } else {
            if (!types.includes('stats')) {
                resetTabs('stats', <Stats {...league} key="stats" />);
            }
        }

        moveTab();
    }, [hideStat, panels, types, leagues]);

    const resetTabs = (type: TabType, Comp: JSX.Element) => {
        let newTypes = [...types];
        let newPanels = [...panels];

        const index = typesMaster.findIndex((item) => item == type);

        newTypes.splice(index, 0, type);
        newPanels.splice(index, 0, Comp);

        setTypes(newTypes);
        setPanels(newPanels);
    };

    const moveTab = () => {
        const url = new URL(window.location.href);

        if (!url.searchParams.has('tab') || !league) return;

        const tab = url.searchParams.get('tab') as TabType;

        if (tab && types.includes(tab)) {
            const index = types.findIndex((item) => item == tab);
            setSelectedIndex(index);
            history.pushState({}, '', `${route('index.league', { slug: league.slug })}?tab=${tab}`);
        } else {
            setSelectedIndex(0);
        }
    };

    const handleChangeTab = (index: number) => {
        if (loading) return;
        setSelectedIndex(index);
        let tab = types.find((item, i) => i == index);
        if (tab) history.pushState({}, '', `${route('index.league', { slug: league.slug })}?tab=${tab}`);
    };

    const getLeagueSeasons = async () => {
        try {
            setLeagueLoading(true);
            const res = await axios.get<SeasonType>(route('league.seasons', { id: league.leagueId }));
            setSeasons(res.data);

            const seasons = res.data.seasons.reverse();
            const currentSeason = seasons[0];
            setLeagueLoading(false);
            setSelectedSeason(currentSeason);
        } catch (error) {
            setLeagueLoading(false);
        }
    };

    useEffect(() => {
        if (league) getLeagueSeasons();
    }, [league]);

    const updateSeason = (season: string) => {
        setSelectedSeason(season);

        league.season = season;

        resetLeague(league.leagueId);
        updateLeagueData(league.leagueId, currentSeason, season);
    };

    return (
        <Deferred
            data="league"
            fallback={
                <GuestLayout>
                    <div className="flex h-full w-full animate-pulse items-center justify-center bg-gray-100">
                        <Loader />
                    </div>
                </GuestLayout>
            }
        >
            <GuestLayout>
                <div className="w-fit">
                    <Link href={route('home')} className="flex items-center gap-x-2 rounded-sm px-1.5 py-1 hover:bg-gray-300">
                        <ArrowLeftCircleIcon className="w-8" />
                        <p className="text-xs font-bold">{t('Home')}</p>
                    </Link>
                </div>
                <div className="mt-2 w-full text-black">
                    <div className="flex justify-between rounded-t-sm bg-white p-2 shadow-sm">
                        <div className="flex items-center justify-center gap-x-3">
                            <div className="h-12 w-12 rounded-full border border-gray-200">
                                <img
                                    className="h-full w-full rounded-full object-fill"
                                    src={league?.logo?.split('.')[0] != `${league?.leagueId}` ? league?.logo : usePlaceholderImage()}
                                    alt={league?.name}
                                />
                            </div>
                            <div className="flex flex-1 flex-col gap-y-2">
                                <h1 className="text-lg leading-4.5 font-semibold capitalize">
                                    {i18next.language == 'en' ? league?.name : league?.nameAr}
                                </h1>
                                <h2 className="text-sm text-gray-500 capitalize">
                                    {i18next.language == 'en' ? league?.country?.name : league?.country?.name_ar}
                                </h2>
                            </div>
                        </div>
                        <div>
                            {!leagueLoading && (
                                <select
                                    className="mr-3 cursor-pointer rounded-full bg-blue-950 px-4 py-2 text-sm font-bold text-white selection:bg-white hover:bg-blue-900"
                                    onChange={(e) => updateSeason(e.target.value)}
                                    value={selectedSeason}
                                >
                                    {seasons?.seasons.map((item) => (
                                        <option value={item} key={item}>
                                            {item}
                                        </option>
                                    ))}
                                </select>
                            )}
                            {/* <button className="cursor-pointer rounded-full bg-red-500 px-4 py-2 text-sm font-bold text-white hover:bg-blue-900">
                                Follow
                            </button> */}
                        </div>
                    </div>

                    {panels.length && types.length && (
                        <div>
                            <TabGroup className="flex h-full w-full flex-col" selectedIndex={selectedIndex} onChange={handleChangeTab}>
                                <TabList className="mb-5 rounded-b-sm !border-0 bg-white p-2 pb-0 shadow-sm">
                                    {types.map((item, index) => (
                                        <Tab
                                            className={cn(
                                                'cursor-pointer rounded-t-sm border-b-4 border-transparent px-5 py-2 text-[13px] font-extrabold capitalize outline-0 hover:border-b-4 hover:border-blue-950 hover:text-blue-950 focus:outline-0',
                                                selectedIndex == index && 'border-b-4 border-red-500',
                                            )}
                                            key={item}
                                        >
                                            {/* <Link href={`${route('index.league', { slug: league.slug })}?season=${selectedSeason}`}>{item}</Link> */}
                                            {t(item)}
                                        </Tab>
                                    ))}
                                </TabList>
                                <TabPanels className="h-full flex-1">
                                    {panels.map((item, index) => (
                                        <TabPanel key={index}>{item}</TabPanel>
                                    ))}
                                </TabPanels>
                            </TabGroup>
                        </div>
                    )}
                </div>
            </GuestLayout>
        </Deferred>
    );
}
