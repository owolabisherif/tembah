import Loader from '@/components/loader';
import useNumberFormatter from '@/hooks/use-number-formatter';
import { usePlaceholderImage } from '@/hooks/user-placeholder-image';
import GuestLayout from '@/layouts/guest-layout';
import { cn } from '@/lib/utils';
import { PlayerInformation } from '@/types/match';
import { Deferred } from '@inertiajs/react';
import { CategoryScale, Chart as ChartJS, Filler, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import i18next, { t } from 'i18next';
import { ArrowLeftCircleIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import Ad from '../partials/ad';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Title, Tooltip, Legend, ChartDataLabels);

export type ShowPlayerProp = {
    slug?: string;
    player: PlayerInformation;
};

export default function Index({ slug, player }: ShowPlayerProp) {
    const [options, setOptions] = useState({});
    const [data, setData] = useState({});

    useEffect(() => {
        if (player) {
            getChartData();
        }
    }, [player]);

    const getChartData = () => {
        try {
            const labels = player.transfers.map((item) => item.year);
            const dt = player.transfers.map((item) => item.price);
            const pointStyle = player.transfers.map((item) => {
                const image = new Image(20, 20);
                image.src = item.from.image ?? usePlaceholderImage();

                return image;
            });

            const mv = [...dt].pop();

            setOptions({
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    interaction: {
                        mode: 'point',
                    },
                    datalabels: {
                        display: false,
                        formatter: function (value: any, context: any) {
                            return context.chart.data.labels[context.dataIndex];
                        },
                    },
                    legend: {
                        display: false,
                        position: 'top' as const,
                    },
                    title: {
                        display: true,
                        text: `${t('Market value')} ${mv ? useNumberFormatter(+mv!) : 0}`,
                    },
                },
            });

            setData({
                labels,
                datasets: [
                    {
                        label: '',
                        data: dt,
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        pointStyle: pointStyle,
                        pointRadius: 20,
                        pointHoverRadius: 15,
                        tension: 0.4,
                        fill: '-1',
                    },
                ],
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Deferred
            data="player"
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
                        <p className="text-xs font-bold">{t('Back')}</p>
                    </button>
                </div>

                {player ? (
                    <>
                        <div className="my-5 w-full text-black">
                            <div className="flex items-center justify-between rounded-t-sm bg-red-500 px-2 py-5 shadow-sm">
                                <div className="flex items-center justify-center gap-x-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 p-0.5">
                                        <img className="h-full w-full rounded-full object-contain" src={player.image ?? usePlaceholderImage()} />
                                    </div>
                                    <div>
                                        <h1 className="font-bold text-white">{i18next.language == 'en' ? player.name : player.nameAr}</h1>
                                        <div className="flex items-center gap-x-1">
                                            <div className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-200">
                                                <img
                                                    className="h-full w-full rounded-full object-cover"
                                                    src={player.teamFlag ?? usePlaceholderImage()}
                                                />
                                            </div>
                                            <h2 className="text-xs text-white capitalize">
                                                {i18next.language == 'en' ? player.team : player.teamAr}
                                            </h2>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    {/* <button className="cursor-pointer rounded-full bg-white px-4 py-2 text-sm font-bold text-red-500 hover:bg-blue-900 hover:text-white">
                                        {t('Follow')}
                                    </button> */}
                                </div>
                            </div>
                            <div className="grid grid-cols-12 gap-x-3 gap-y-5 rounded-b-sm bg-white p-2 shadow-sm">
                                <div className="col-span-3 border-b border-b-gray-100 pb-2">
                                    <h3 className="mb-0 text-lg font-bold text-black">
                                        {player.age} {t('years')}
                                    </h3>
                                    <p className="text-xs font-bold text-gray-500">{player.birthDate ?? '-'}</p>
                                </div>
                                <div className="col-span-3 border-b border-b-gray-100 pb-2">
                                    <h3 className="mb-0 text-lg font-bold text-black">{player.height ?? '-'}</h3>
                                    <p className="text-xs font-bold text-gray-500">{t('Height')}</p>
                                </div>
                                <div className="col-span-3 border-b border-b-gray-100 pb-2">
                                    <h3 className="mb-0 text-lg font-bold text-black">{player.shirt != '0' ? player.shirt : '-'}</h3>
                                    <p className="text-xs font-bold text-gray-500">{t('Shirt')}</p>
                                </div>
                                <div className="col-span-3 border-b border-b-gray-100 pb-2">
                                    <h3 className="mb-0 text-lg font-bold text-black">{player.weight ?? '-'}</h3>
                                    <p className="text-xs font-bold text-gray-500">{t('Weight')}</p>
                                </div>
                                <div className="col-span-3 border-b border-b-gray-100 pb-2">
                                    <div className="flex items-center gap-x-1">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-200">
                                            <img
                                                className="h-full w-full rounded-full object-cover"
                                                src={player.birthCountryFlag ?? usePlaceholderImage()}
                                            />
                                        </div>
                                        <h3 className="mb-0 text-lg font-bold text-black">
                                            {i18next.language == 'en' ? player.birthCountry : player.birthCountryAr}
                                        </h3>
                                    </div>
                                    <p className="text-xs font-bold text-gray-500">{t('Country')}</p>
                                </div>
                                <div className="col-span-3 border-b border-b-gray-100 pb-2">
                                    <h3 className="mb-0 text-lg font-bold text-black">
                                        {player.birthPlace ? (i18next.language == 'en' ? player.birthPlace : player.birthPlaceAr) : '-'}
                                    </h3>
                                    <p className="text-xs font-bold text-gray-500">{t('Birth place')}</p>
                                </div>
                                <div className="col-span-3 border-b border-b-gray-100 pb-2">
                                    <h3 className="mb-0 text-lg font-bold text-black">
                                        {i18next.language == 'en' ? player.position : player.positionAr}
                                    </h3>
                                    <p className="text-xs font-bold text-gray-500">{t('Position')}</p>
                                </div>
                                <div className="col-span-3 border-b border-b-gray-100 pb-2">
                                    <h3 className="mb-0 text-lg font-bold text-black">
                                        {player.preferredFoot ? (i18next.language == 'en' ? player.preferredFoot : player.preferredFootAr) : '-'}
                                    </h3>
                                    <p className="text-xs font-bold text-gray-500">{t('Preferred foot')}</p>
                                </div>
                                <div className="col-span-3 border-b border-b-gray-100 pb-2">
                                    <h3 className="mb-0 text-lg font-bold text-black">
                                        {player.marketValue ? useNumberFormatter(+player.marketValue) : '-'}
                                    </h3>
                                    <p className="text-xs font-bold text-gray-500">{t('Transfer value')}</p>
                                </div>
                            </div>
                        </div>
                        <Ad />
                        {Boolean(Object.entries(data).length) && (
                            <div className="my-5 h-96 w-full rounded-sm bg-white p-5 shadow-sm">
                                <Line options={options} data={data as any} width={100} height={100} />
                            </div>
                        )}
                        <Ad />
                        {player && player.statistic && (
                            <>
                                <div className="mt-5 flex items-center justify-between rounded-t-sm bg-blue-900 px-2 py-4 shadow-sm">
                                    <h3 className="font-bold text-white">
                                        {i18next.language == 'en' ? player.statistic.league : player.statistic.leagueAr} {player.statistic.season}
                                    </h3>
                                </div>
                                <div className="grid grid-cols-12 gap-5 rounded-b-sm bg-white p-5 shadow-sm">
                                    <div className="col-span-3 flex flex-col items-center justify-center pb-2">
                                        <div className="flex items-center gap-x-1">
                                            <div className="h-4 w-4 rounded-xs">
                                                <img className="h-full w-full" src="/assets/svgs/Soccerball.svg" />
                                            </div>
                                            <h3 className="mb-0 text-lg font-bold text-black">
                                                {new Intl.NumberFormat().format(player.statistic.goals)}
                                            </h3>
                                        </div>
                                        <p className="text-xs font-bold text-gray-500">{t('Goals')}</p>
                                    </div>
                                    <div className="col-span-3 flex flex-col items-center justify-center pb-2">
                                        <h3 className="mb-0 text-lg font-bold text-black">{player.statistic.assist}</h3>
                                        <p className="text-xs font-bold text-gray-500">{t('Assist')}</p>
                                    </div>
                                    <div className="col-span-3 flex flex-col items-center justify-center pb-2">
                                        <div className="flex items-center gap-x-1">
                                            <div className="h-4 w-4 rounded-xs">
                                                <img className="h-full w-full" src="/assets/svgs/clock.svg" />
                                            </div>
                                            <h3 className="mb-0 text-lg font-bold text-black">
                                                {new Intl.NumberFormat().format(player.statistic.minutesPlayed)}
                                            </h3>
                                        </div>
                                        <p className="text-xs font-bold text-gray-500">{t('Minutes played')}</p>
                                    </div>
                                    <div className="col-span-3 flex flex-col items-center justify-center pb-2">
                                        <h3 className="mb-0 text-lg font-bold text-black">{player.statistic.matches}</h3>
                                        <p className="text-xs font-bold text-gray-500">{t('Matches')}</p>
                                    </div>
                                    <div className="col-span-3 flex flex-col items-center justify-center pb-2">
                                        <h3 className="mb-0 text-lg font-bold text-black">{player.statistic.keyPasses}</h3>
                                        <p className="text-xs font-bold text-gray-500">{t('Key passes')}</p>
                                    </div>
                                    <div className="col-span-3 flex flex-col items-center justify-center pb-2">
                                        <div className="flex items-center justify-center rounded-sm bg-blue-900 px-2 py-0.5 text-white">
                                            <h3 className="mb-0 text-lg font-bold">{player.statistic.rating}</h3>
                                        </div>
                                        <p className="text-xs font-bold text-gray-500">{t('Rating')}</p>
                                    </div>
                                    <div className="col-span-3 flex flex-col items-center justify-center pb-2">
                                        <div className="flex items-center gap-x-1">
                                            <div className="h-4 w-3 rounded-xs bg-amber-400"></div>
                                            <h3 className="mb-0 text-lg font-bold text-black">{player.statistic.yellow}</h3>
                                        </div>
                                        <p className="text-xs font-bold text-gray-500">{t('Yellow card')}</p>
                                    </div>
                                    <div className="col-span-3 flex flex-col items-center justify-center pb-2">
                                        <div className="flex items-center gap-x-1">
                                            <div className="h-4 w-3 rounded-xs bg-red-500"></div>
                                            <h3 className="mb-0 text-lg font-bold text-black">{player.statistic.red}</h3>
                                        </div>
                                        <p className="text-xs font-bold text-gray-500">{t('Red card')}</p>
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="grid grid-cols-12 gap-x-4">
                            {player.trophies.length && (
                                <div className={cn('flex h-full flex-col', player.overallClubStats ? 'col-span-12 md:col-span-6' : 'col-span-12')}>
                                    <div className="mt-5 flex items-center justify-between rounded-t-sm bg-blue-900 px-2 py-4 shadow-sm">
                                        <h3 className="font-bold text-white">{t('Trophies')}</h3>
                                    </div>
                                    <div className="flex h-full flex-wrap gap-5 rounded-b-sm bg-white p-5 shadow-sm">
                                        {player.trophies.map((item, index) => (
                                            <div className="mb-3 flex items-center gap-x-2" key={`${item.league}-${index}`}>
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white">
                                                    <p>{item.count}</p>
                                                </div>
                                                <div className="flex flex-1 flex-col">
                                                    <h3 className="mb-0 text-sm font-bold text-black">
                                                        {i18next.language == 'en' ? item.league : item.leagueAr}
                                                    </h3>
                                                    {Boolean(item.seasons.length) && (
                                                        <div className="flex flex-wrap gap-x-1">
                                                            {item.seasons
                                                                .filter((item) => item != '')
                                                                .map((season) => (
                                                                    <div
                                                                        className="flex h-fit w-fit rounded-full bg-gray-200 px-1 py-0.5"
                                                                        key={season}
                                                                    >
                                                                        <p className="text-xs">{season}</p>
                                                                    </div>
                                                                ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {player.overallClubStats && (
                                <div className={cn('flex h-full flex-col', player.trophies.length ? 'col-span-12 md:col-span-6' : 'col-span-12')}>
                                    <div className="mt-5 flex items-center justify-between rounded-t-sm bg-blue-900 px-2 py-4 shadow-sm">
                                        <h3 className="font-bold text-white">{t('Overall Club Statistics')}</h3>
                                    </div>
                                    <div className="grid grid-cols-12 gap-5 rounded-b-sm bg-white p-5 shadow-sm">
                                        <div className="col-span-4">
                                            <h3 className="mb-0 text-lg font-bold text-black">{player.overallClubStats.matches}</h3>
                                            <p className="text-xs font-bold text-gray-500">{t('Matches')}</p>
                                        </div>
                                        <div className="col-span-4">
                                            <h3 className="mb-0 text-lg font-bold text-black">
                                                {new Intl.NumberFormat().format(player.overallClubStats.minutesPlayed)}
                                            </h3>
                                            <p className="text-xs font-bold text-gray-500">{t('Minutes played')}</p>
                                        </div>
                                        <div className="col-span-4">
                                            <h3 className="mb-0 text-lg font-bold text-black">
                                                {new Intl.NumberFormat().format(player.overallClubStats.passes)}
                                            </h3>
                                            <p className="text-xs font-bold text-gray-500">{t('Passes')}</p>
                                        </div>
                                        <div className="col-span-4">
                                            <h3 className="mb-0 text-lg font-bold text-black">{player.overallClubStats.keyPasses}</h3>
                                            <p className="text-xs font-bold text-gray-500">{t('Key passes')}</p>
                                        </div>
                                        <div className="col-span-4">
                                            <h3 className="mb-0 text-lg font-bold text-black">{player.overallClubStats.rating}</h3>
                                            <p className="text-xs font-bold text-gray-500">{t('Rating')}</p>
                                        </div>
                                        <div className="col-span-4">
                                            <h3 className="mb-0 text-lg font-bold text-black">{player.overallClubStats.dribbles}</h3>
                                            <p className="text-xs font-bold text-gray-500">{t('Dribbles')}</p>
                                        </div>
                                        <div className="col-span-4">
                                            <h3 className="mb-0 text-lg font-bold text-black">{player.overallClubStats.shots}</h3>
                                            <p className="text-xs font-bold text-gray-500">{t('Shots')}</p>
                                        </div>
                                        <div className="col-span-4">
                                            <h3 className="mb-0 text-lg font-bold text-black">{player.overallClubStats.tackles}</h3>
                                            <p className="text-xs font-bold text-gray-500">{t('Tackles')}</p>
                                        </div>
                                        <div className="col-span-4">
                                            <h3 className="mb-0 text-lg font-bold text-black">{player.overallClubStats.penScored}</h3>
                                            <p className="text-xs font-bold text-gray-500">{t('Penalty scored')}</p>
                                        </div>
                                        <div className="col-span-4">
                                            <h3 className="mb-0 text-lg font-bold text-black">{player.overallClubStats.assist}</h3>
                                            <p className="text-xs font-bold text-gray-500">{t('Assists')}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex w-full flex-col items-center justify-center">
                        <Ad />
                        <p className="font-bold">{t('No information avalible for the selected player, please check back later.')}</p>
                    </div>
                )}
            </GuestLayout>
        </Deferred>
    );
}
