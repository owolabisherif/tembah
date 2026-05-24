import Loader from '@/components/loader';
import SoccerCard from '@/components/soccer-card';
import { usePlaceholderImage } from '@/hooks/user-placeholder-image';
import GuestLayout from '@/layouts/guest-layout';
import { cn } from '@/lib/utils';
import { SharedData } from '@/types';
import { Fixture } from '@/types/match';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { Deferred, Link, router, usePage } from '@inertiajs/react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import i18next, { t } from 'i18next';
import { ArrowLeftCircleIcon, Calendar, LandPlotIcon } from 'lucide-react';
import { JSX, useEffect, useState } from 'react';
import Ad from './partials/ad';
import HeadToHead from './partials/show-match/head-to-head';
import Overview from './partials/show-match/overview';
import Table from './partials/show-match/table';

type TabType = 'overview' | 'table' | 'head to head';

type ShowMatchProp = {
    slug: string;
    fixture: Fixture | null;
    staticId?: number;
    fixtureId?: number;
    seasons?: string[];
};

const queryClient = new QueryClient();

const ShowMatchLayout = ({ slug, fixture }: ShowMatchProp) => {
    const placeholderImage = '/assets/images/logo2.png';
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedSeason, setSelectedSeason] = useState<string>('');
    const currentSeason = usePage<SharedData>().props.currentSeason;
    const [types, setTypes] = useState<TabType[]>([]);
    const [panels, setPanels] = useState<JSX.Element[]>([]);

    const panelsMaster = [
        <Overview key="overview" slug={slug} fixture={fixture!} />,
        <Table {...fixture!} />,
        <HeadToHead key="head-to-head" slug={slug} />,
    ];

    const typesMaster: TabType[] = ['overview', 'table', 'head to head'];

    let statusTemp: string[] = ['pen.', 'ft', 'aet', 'ht', 'wo', 'postp.', 'aban.', 'cancl.', 'susp.', 'int.', 'delayed', 'awarded'];

    let statusBlacklist: string[] = ['pen.', 'aet', 'wo', 'postp.', 'aban.', 'cancl.', 'susp.', 'int.', 'delayed', 'awarded'];

    useQuery({
        queryKey: ['fixture'],
        initialData: null,
        queryFn: async () => {
            router.reload({ only: ['fixture'] });
            return null;
        },
        refetchInterval: 30_000,
    });

    useEffect(() => {
        if (fixture) {
            console.log(fixture);
            setPanels(panelsMaster);
            setTypes(typesMaster);
        }

        const params = new URLSearchParams(window.location.search);
        const type = params.get('tab') ?? 'overview';
        const index = typesMaster.findIndex((item) => item == type);
        handleChangeTab(index);
    }, [fixture]);

    const handleChangeTab = (index: number) => {
        setSelectedIndex(index);
        let tab = types.find((item, i) => i == index);

        if (tab) history.pushState({}, '', `${route('soccer.team.matches', { slug: slug.trim() })}?tab=${tab.split(' ').join('-')}`);
    };

    const getTranslation = (fixture: Fixture) => {
        if (fixture.leagueData) return i18next.language == 'en' ? fixture.leagueData.name : fixture.leagueData.nameAr;

        return i18next.language == 'en' ? fixture.league : fixture.leagueAr;
    };

    const getVenue = (fixture: Fixture) => {
        if (fixture.match.venueCity) return i18next.language == 'en' ? fixture.match.venueCity : fixture.match.venueCityAr;

        return i18next.language == 'en' ? fixture.match.venue : fixture.match.venueAr;
    };

    return (
        <Deferred
            data="fixture"
            fallback={
                <GuestLayout>
                    <Ad />
                    <div className="mt-5"></div>
                    <Loader />
                </GuestLayout>
            }
        >
            <GuestLayout title={fixture ? `${fixture.match.homeTeam.name} vs ${fixture.match.awayTeam.name}` : t('Welcome')}>
                <div className="mt-5 w-fit">
                    <Link
                        href={route('soccer.matches', { period: 'home' })}
                        className="flex items-center gap-x-2 rounded-sm px-1.5 py-1 hover:bg-gray-300"
                    >
                        <ArrowLeftCircleIcon className="w-8" />
                        <p className="text-xs font-bold">{t('Matches')}</p>
                    </Link>
                </div>
                <h1 className="hidden">{fixture ? `${fixture.match.awayTeam.name} vs ${fixture.match.awayTeam.name}` : t('Welcome')}</h1>
                {fixture ? (
                    <div className="mt-5 w-full text-black">
                        <div className="flex justify-between rounded-t-sm bg-white p-2 shadow-sm dark:bg-neutral-800 dark:text-white">
                            <div className="flex items-center justify-center gap-x-3">
                                <div className="h-12 w-12 shrink-0 rounded-full border border-gray-200">
                                    <img className="h-full w-full rounded-full object-fill" src={fixture.leagueData.logo ?? usePlaceholderImage()} />
                                </div>
                                <div>
                                    <p className="font-bold">{getTranslation(fixture)}</p>
                                    <p>{fixture.leagueData.season}</p>
                                </div>
                            </div>
                            {/* <div>
                                <button className="cursor-pointer rounded-full bg-red-500 px-4 py-2 text-sm font-bold text-white hover:bg-blue-900">
                                    Follow
                                </button>
                            </div> */}
                        </div>

                        <div className="flex justify-center gap-x-3 bg-white p-3 shadow-sm dark:bg-neutral-800 dark:text-white">
                            <div className="flex items-center gap-x-1 font-bold">
                                <Calendar className="size-4" />
                                <p className="text-xs text-black dark:text-white">
                                    {fixture.match.date} {fixture.match.time}
                                </p>
                            </div>

                            {fixture.match.venue && (
                                <div className="flex items-center gap-x-1 font-bold">
                                    <LandPlotIcon className="size-4" />
                                    <p className="text-xs text-black capitalize">{getVenue(fixture)}</p>
                                </div>
                            )}
                        </div>
                        {panels.length && (
                            <div>
                                <div className="flex items-center gap-x-5 bg-white px-4 py-3 shadow-sm dark:bg-neutral-800 dark:text-white">
                                    {fixture.match.status.toLowerCase() != 'not started' &&
                                    !statusBlacklist.includes(fixture.match.status.toLowerCase()) ? (
                                        <div
                                            className={cn(
                                                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-900 text-xs font-bold text-white',
                                            )}
                                        >
                                            {fixture.match.status}
                                        </div>
                                    ) : (
                                        <div
                                            className={cn(
                                                'flex h-10 w-10 items-center justify-center rounded-full bg-transparent text-xs font-bold text-black dark:text-white',
                                            )}
                                        >
                                            {fixture.match.status.toLowerCase() != 'not started' ? fixture.match.status : ''}
                                        </div>
                                    )}

                                    <Link
                                        className="flex flex-1 items-center justify-end gap-x-1"
                                        href={route('soccer.show.team.index', {
                                            slug: `${fixture.match.homeTeam.slug}`,
                                            ids: `${fixture.match.homeTeam.teamId}-${fixture.leagueData.leagueId}`,
                                        })}
                                    >
                                        <h3 className="text-md line-clamp-1 text-center font-semibold whitespace-normal text-black dark:text-white">
                                            {i18next.language == 'en' ? fixture.match.homeTeam.name : fixture.match.homeTeam.nameAr}
                                        </h3>
                                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-gray-100">
                                            <img
                                                src={
                                                    fixture.homeTeam ? fixture.homeTeam.image : (fixture.match.homeTeam.logo ?? usePlaceholderImage())
                                                }
                                                alt={fixture.match.homeTeam.name}
                                                className="h-full w-full object-contain object-center"
                                            />
                                        </div>
                                    </Link>

                                    <div
                                        className={cn(
                                            'relative flex w-24 items-center justify-center rounded-sm',
                                            fixture.match.isLive ? 'animate-pulse bg-green-300 dark:bg-neutral-700' : 'bg-gray-300',
                                        )}
                                    >
                                        <SoccerCard homeTeam={fixture.match.homeTeam} awayTeam={fixture.match.awayTeam} />

                                        {statusTemp.includes(fixture.match.status.toLowerCase()) ? (
                                            <div className="relative flex flex-col items-center justify-center gap-y-2">
                                                <SoccerCard homeTeam={fixture.match.homeTeam} awayTeam={fixture.match.awayTeam} />
                                                <div className="flex justify-between gap-x-1 p-1">
                                                    <img src="/assets/svgs/whistle.svg" alt="" className="w-4" />
                                                    <p className="text-xs font-black">
                                                        {fixture.match.homeTeam.ftScore} - {fixture.match.awayTeam.ftScore}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : fixture.match.status.toLowerCase().trim() == 'not started' ? (
                                            <div className="flex flex-col items-center justify-center gap-y-2">
                                                <div className="flex gap-x-1 p-1">
                                                    <img src="/assets/svgs/clock.svg" alt="" className="w-4" />
                                                    <p className="text-xs font-black">{fixture.match.time}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="relative flex flex-col items-center justify-center gap-y-2">
                                                <SoccerCard homeTeam={fixture.match.homeTeam} awayTeam={fixture.match.awayTeam} />
                                                <div className="flex gap-x-1 p-1">
                                                    <img src="/assets/svgs/whistle.svg" alt="" className="w-4" />
                                                    <p className="text-xs font-black">
                                                        {fixture.match.homeTeam.ftScore} - {fixture.match.awayTeam.ftScore}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <Link
                                        className="flex w-full flex-1 items-center justify-start gap-x-1"
                                        href={route('soccer.show.team.index', {
                                            slug: `${fixture.match.awayTeam.slug}`,
                                            ids: `${fixture.match.awayTeam.teamId}-${fixture.leagueData.leagueId}`,
                                        })}
                                    >
                                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-gray-100">
                                            <img
                                                src={
                                                    fixture.awayTeam ? fixture.awayTeam.image : (fixture.match.awayTeam.logo ?? usePlaceholderImage())
                                                }
                                                alt={fixture.match.awayTeam.name}
                                                className="h-full w-full object-contain object-center"
                                            />
                                        </div>

                                        <h3 className="text-md line-clamp-1 text-center font-semibold whitespace-normal text-black dark:text-white">
                                            {i18next.language == 'en' ? fixture.match.awayTeam.name : fixture.match.awayTeam.nameAr}
                                        </h3>
                                    </Link>
                                </div>

                                <TabGroup className="flex h-full w-full flex-col" selectedIndex={selectedIndex} onChange={handleChangeTab}>
                                    <TabList className="mb-5 rounded-b-sm !border-0 bg-white p-2 pb-0 shadow-sm dark:bg-neutral-800">
                                        {types.map((item, index) => (
                                            <Tab
                                                className={cn(
                                                    'cursor-pointer rounded-t-sm border-b-4 border-transparent px-5 py-2 text-[13px] font-extrabold capitalize outline-0 hover:border-b-4 hover:border-blue-950 hover:text-blue-950 focus:outline-0 dark:text-white',
                                                    selectedIndex == index && 'border-b-4 border-red-500 dark:border-neutral-500',
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
                ) : (
                    <div className="flex w-full flex-col items-center justify-center">
                        <Ad />
                        <p className="font-bold">{t('No information avalible for the selected games, please check back later.')}</p>
                    </div>
                )}
            </GuestLayout>
        </Deferred>
    );
};

export default function showMatch({ slug, fixture }: ShowMatchProp) {
    return (
        <QueryClientProvider client={queryClient}>
            <ShowMatchLayout slug={slug} fixture={fixture} />
        </QueryClientProvider>
    );
}
