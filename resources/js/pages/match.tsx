import Loader from '@/components/loader';
import SoccerCard from '@/components/soccer-card';
import { Accordion, AccordionContent, AccordionHeader, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { usePlaceholderImage } from '@/hooks/user-placeholder-image';
import GuestLayout from '@/layouts/guest-layout';
import { cn } from '@/lib/utils';
import useFixtureStore from '@/stores/use-fixtures-store';
import { SharedData } from '@/types';
import { Fixtures } from '@/types/match';
import { Link, usePage, usePoll } from '@inertiajs/react';
import i18next, { t } from 'i18next';
import { ArrowLeftCircleIcon, ChevronDownIcon, ChevronUp, ChevronUpIcon, FilterIcon, RotateCwIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import Select from 'react-select';
import Ad from './partials/ad';

type MatchProp = {
    period: string;
};

type SelectType = { label: string; value: string };

export default function Match({ period }: MatchProp) {
    const [value, setValue] = useState<string[]>([]);
    const [tabs, setTabs] = useState<string[]>([]);
    const [searchText, updateSearchText] = useState<string>('');
    const [selected, setSelected] = useState<SelectType>({ label: 'Today', value: 'home' });
    const [mount, setMount] = useState<boolean>(false);
    const [fixtureList, setFixtureList] = useState<Fixtures[]>([]);
    const page = usePage<SharedData>().props;
    const { loading, leagues, matches, fixtures, initFixtures, getFilteredMatches, getFilteredMatchesByDate, refreshFixtures, getLiveFixtures } =
        useFixtureStore();

    let statusTemp: string[] = ['pen.', 'ft', 'aet', 'ht', 'wo', 'postp.', 'aban.', 'cancl.', 'susp.', 'int.', 'delayed', 'awarded'];

    let statusBlacklist: string[] = ['pen.', 'aet', 'wo', 'postp.', 'aban.', 'cancl.', 'susp.', 'int.', 'delayed', 'awarded'];

    const { start, stop } = usePoll(
        60000,
        {
            onStart() {
                refreshFixtures();
            },
            onFinish() {
                console.log('finish');
            },
        },
        { autoStart: false },
    );

    useEffect(() => {
        if (fixtures.length) {
            let tabs: string[] = [];
            for (let index = 0; index < fixtures.length; index++) {
                tabs[index] = `${index}`;
            }
            setTabs(tabs);
            setValue(tabs);

            setFixtureList(fixtures);
        }
    }, [fixtures]);

    useEffect(() => {
        const select = page.periods.find((item) => item.value == period);
        if (select) {
            setSelected(select);

            if (select.value != 'home') handlePeriod(select);
            else initFixtures();

            if (select.value == 'home') start();
        }

        setMount(true);

        return () => {
            stop();
        };
    }, []);

    const handlePeriod = (period: any) => {
        history.pushState({}, '', `${route('soccer.matches', { period: period.value })}`);
        if (period.value == 'home') {
            start();
        } else {
            stop();
        }
        getFilteredMatchesByDate(period.value);
    };

    const getTimer = (timer: string) => {
        if (+timer > 90) {
            let dif = +timer - 90;
            return `90+${dif}`;
        }

        return timer;
    };

    const filteredFixtures = useMemo<Fixtures[]>(() => {
        let searched = fixtures.filter((item) => {
            return (
                item.league.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()) ||
                item.leagueAr.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()) ||
                item.matches.find(
                    (item) =>
                        item.awayTeam.name?.toLocaleLowerCase().includes(searchText) ||
                        item.awayTeam.nameAr?.toLocaleLowerCase().includes(searchText),
                ) ||
                item.matches.find(
                    (item) =>
                        item.homeTeam.name?.toLocaleLowerCase().includes(searchText) ||
                        item.homeTeam.nameAr?.toLocaleLowerCase().includes(searchText),
                )
            );
        });

        return !searchText ? fixtures : searched;
    }, [searchText, fixtures]);

    return (
        <GuestLayout title="All Matches">
            <div className="mb-3 w-fit">
                <Link href={route('home')} className="flex items-center gap-x-2 rounded-sm px-1.5 py-1 hover:bg-gray-300">
                    <ArrowLeftCircleIcon className="w-8" />
                    <p className="text-xs font-bold">{t('Home')}</p>
                </Link>
            </div>
            <div className="mb-8 flex max-h-[47rem] flex-col items-center gap-y-3 rounded-sm bg-gray-100 p-4 shadow-sm dark:bg-neutral-800">
                {mount && (
                    <div>
                        <Select
                            openMenuOnClick={false}
                            defaultValue={selected}
                            onChange={handlePeriod}
                            isSearchable={false}
                            isMulti={false}
                            options={page.periods}
                            classNames={{
                                control: (state) =>
                                    '!rounded-full !focus:ring-0 !active:ring-0 !border-gray-300 !w-64 !focus:outline-none !active:outline-none !focus:border-0 !dark:bg-neutral-800',
                            }}
                        />
                    </div>
                )}
                <div className="flex w-full gap-x-2">
                    <div className="flex flex-1 items-center justify-center rounded-full border border-gray-300 pl-1">
                        <FilterIcon className="w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder={t('Filter by country e.g Qatar')}
                            className="h-full w-full p-1 outline-0 placeholder:text-xs focus:outline-0"
                            value={searchText}
                            onInput={(e) => updateSearchText((e.target as HTMLInputElement).value)}
                        />
                        <button
                            onClick={() => updateSearchText('')}
                            className={cn(
                                'cursor-pointer pr-1 transition-all delay-75 hover:text-blue-950',
                                searchText.length ? 'animate-fadein opacity-100' : 'animate-fadeout opacity-0',
                            )}
                            title="Clear search text"
                        >
                            <RotateCwIcon className="w-4" />
                        </button>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <button
                            onClick={() => setValue([])}
                            className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-blue-900 hover:bg-blue-800 dark:bg-neutral-700 dark:hover:bg-neutral-600"
                        >
                            <ChevronUpIcon className="size-5 font-bold text-white" />
                        </button>
                        <button
                            onClick={() => setValue(tabs)}
                            className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-blue-900 hover:bg-blue-800 dark:bg-neutral-700 dark:hover:bg-neutral-600"
                        >
                            <ChevronDownIcon className="size-5 font-bold text-white" />
                        </button>
                    </div>
                </div>
            </div>

            <Ad />

            {Boolean(filteredFixtures.length) && !loading ? (
                <Accordion type="multiple" value={value} onValueChange={setValue} className={cn('mt-5 transition-all')}>
                    {filteredFixtures.map((item, index) => (
                        <AccordionItem value={`${index}`} className="mb-5 rounded-sm bg-blue-100 shadow-sm" key={item.league}>
                            <AccordionHeader
                                className={cn(
                                    'mb-0 w-full bg-blue-900 dark:bg-neutral-800',
                                    value.includes(`${index}`) ? 'rounded-t-md' : 'rounded-md',
                                )}
                            >
                                <AccordionTrigger className="w-full">
                                    <div className="flex w-full cursor-pointer justify-start rounded-xl p-3 select-none">
                                        <div className="flex w-full justify-between">
                                            {item.leagueData ? (
                                                <Link href={route('index.league', { slug: item.leagueData.slug })} className="font-bold text-white">
                                                    {i18next.language == 'en' ? item.leagueData.name : item.leagueData.nameAr}
                                                </Link>
                                            ) : (
                                                <p className="font-bold text-white">{item.league}</p>
                                            )}

                                            <ChevronUp className={cn('text-white transition-all', value.includes(`${index}`) ? '-rotate-180' : '')} />
                                        </div>
                                    </div>
                                </AccordionTrigger>
                            </AccordionHeader>
                            <AccordionContent className="flex flex-col rounded-b-sm py-5 transition-all dark:bg-neutral-700 dark:text-white">
                                {item.matches.map((game, idx) => (
                                    <Link
                                        href={route('soccer.team.matches', { slug: game.slug })}
                                        className="flex items-center gap-x-5 px-4 py-3 hover:bg-blue-200 dark:hover:bg-neutral-200 dark:hover:text-black"
                                        key={`${game.homeTeam.slug}-vs-${game.awayTeam.slug}-${idx}`}
                                    >
                                        {game.status.toLowerCase() != 'not started' && !statusBlacklist.includes(game.status.toLowerCase()) ? (
                                            <div
                                                className={cn(
                                                    'flex h-10 w-10 items-center justify-center rounded-full bg-blue-900 text-xs font-bold text-white dark:bg-neutral-800',
                                                )}
                                            >
                                                {game.timer != '' ? getTimer(game.timer) : game.status}
                                            </div>
                                        ) : (
                                            <div
                                                className={cn(
                                                    'flex h-7 w-7 items-center justify-center rounded-full bg-transparent text-xs font-bold text-black',
                                                )}
                                            >
                                                {game.status.toLowerCase() != 'not started' ? game.status : ''}
                                            </div>
                                        )}

                                        <div className="flex flex-1 items-center justify-end gap-x-1">
                                            <h3 className="line-clamp-1 text-center text-xs font-semibold whitespace-normal">
                                                {' '}
                                                {i18next.language == 'en' ? game.homeTeam.name : game.homeTeam.nameAr}
                                            </h3>
                                            <div className="h-7 w-7 shrink-0 overflow-hidden rounded-full border border-gray-100 dark:border-neutral-100">
                                                <img
                                                    src={game.homeTeam.logo ?? usePlaceholderImage()}
                                                    alt={game.homeTeam.name}
                                                    className="h-full w-full object-contain object-center"
                                                />
                                            </div>
                                        </div>
                                        <div
                                            className={cn(
                                                'relative flex w-24 items-center justify-center rounded-sm',
                                                game.isLive ? 'animate-pulse bg-green-300 dark:bg-neutral-600 dark:text-white' : 'bg-gray-300',
                                            )}
                                        >
                                            <SoccerCard homeTeam={game.homeTeam} awayTeam={game.awayTeam} />

                                            {statusTemp.includes(game.status.toLowerCase()) ? (
                                                <div className="flex flex-col items-center justify-center gap-y-2">
                                                    <div className="flex gap-x-1 p-1">
                                                        <img src="/assets/svgs/whistle.svg" alt="" className="w-4" />
                                                        <p className="text-xs font-black">
                                                            {game.homeTeam.ftScore} - {game.awayTeam.ftScore}
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : game.status.toLowerCase().trim() == 'not started' ? (
                                                <div className="flex flex-col items-center justify-center gap-y-2">
                                                    <div className="flex gap-x-1 p-1">
                                                        <img src="/assets/svgs/clock.svg" alt="" className="w-4" />
                                                        <p className="text-xs font-black">{game.time}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center gap-y-2">
                                                    <div className="flex gap-x-1 p-1">
                                                        <img src="/assets/svgs/whistle.svg" alt="" className="w-4" />
                                                        <p className="text-xs font-black">
                                                            {game.homeTeam.ftScore} - {game.awayTeam.ftScore}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex w-full flex-1 items-center justify-start gap-x-1">
                                            <div className="h-7 w-7 shrink-0 overflow-hidden rounded-full border border-gray-100 dark:border-neutral-100">
                                                <img
                                                    src={game.awayTeam.logo ?? usePlaceholderImage()}
                                                    alt={game.awayTeam.name}
                                                    className="h-full w-full object-contain object-center"
                                                />
                                            </div>

                                            <h3 className="line-clamp-1 text-center text-xs font-semibold whitespace-normal">
                                                {i18next.language == 'en' ? game.awayTeam.name : game.awayTeam.nameAr}
                                            </h3>
                                        </div>
                                    </Link>
                                ))}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            ) : loading ? (
                <Loader />
            ) : (
                <div>
                    <p>No Match to show, please check back.</p>
                </div>
            )}
        </GuestLayout>
    );
}
