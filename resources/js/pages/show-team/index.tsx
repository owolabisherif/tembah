import Loader from '@/components/loader';
import { usePlaceholderImage } from '@/hooks/user-placeholder-image';
import GuestLayout from '@/layouts/guest-layout';
import { cn } from '@/lib/utils';
import { MainTeam } from '@/types/match';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { Deferred } from '@inertiajs/react';
import { ArrowLeftCircleIcon } from 'lucide-react';
import { JSX, useEffect, useState } from 'react';
import Ad from '../partials/ad';
import Overview from './overview';
import Squad from './squad';
import Table from './table';

type TabType = 'overview' | 'table' | 'squad';

export type ShowTeamProp = {
    slug?: string;
    league: number | null;
    team: MainTeam;
};

export default function ShowTeam({ slug, team, league }: ShowTeamProp) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [types, setTypes] = useState<TabType[]>([]);
    const [panels, setPanels] = useState<JSX.Element[]>([]);
    const panelsMaster = [
        <Overview key="overview" team={team!} league={league} />,
        <Table key="table" team={team!} league={league} />,
        <Squad key="table" team={team!} league={league} />,
    ];

    const typesMaster: TabType[] = ['overview', 'table', 'squad'];

    useEffect(() => {
        console.log(team);
        if (team) {
            setPanels(panelsMaster);
            setTypes(typesMaster);
        }

        const params = new URLSearchParams(window.location.search);
        const type = params.get('tab') ?? 'overview';
        const index = typesMaster.findIndex((item) => item == type);
        handleChangeTab(index);
    }, [team]);

    const handleChangeTab = (index: number) => {
        setSelectedIndex(index);
        let tab = types.find((item, i) => i == index);
        if (tab)
            history.pushState(
                {},
                '',
                `${route('soccer.show.team.index', { slug: slug!.trim(), ids: `${team.teamId}-${league}` })}?tab=${tab.split(' ').join('-')}`,
            );
    };

    return (
        <Deferred
            data="team"
            fallback={
                <GuestLayout>
                    <Ad />
                    <div className="mt-5"></div>
                    <Loader />
                </GuestLayout>
            }
        >
            <GuestLayout>
                <div className="mt-5 w-fit">
                    <button
                        onClick={() => history.go(-1)}
                        className="flex cursor-pointer items-center gap-x-2 rounded-sm px-1.5 py-1 hover:bg-gray-300"
                    >
                        <ArrowLeftCircleIcon className="w-8" />
                        <p className="text-xs font-bold">Back</p>
                    </button>
                </div>
                {team ? (
                    <div className="mt-5 w-full text-black">
                        <div className="flex justify-between rounded-t-sm bg-white p-2 shadow-sm">
                            <div className="flex items-center justify-center gap-x-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 p-0.5">
                                    <img className="h-full w-full rounded-full object-contain" src={team.image ?? usePlaceholderImage()} />
                                </div>
                                <div>
                                    <p className="font-bold text-black">{team.fullname}</p>
                                    <p className="text-xs text-gray-500 capitalize">{team.country}</p>
                                </div>
                            </div>
                            <div>
                                <button className="cursor-pointer rounded-full bg-red-500 px-4 py-2 text-sm font-bold text-white hover:bg-blue-900">
                                    Follow
                                </button>
                            </div>
                        </div>

                        {panels.length && (
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
                                                {item}
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
                        <p className="font-bold">No information avalible for the selected team, please check back later.</p>
                    </div>
                )}
            </GuestLayout>
        </Deferred>
    );
}
