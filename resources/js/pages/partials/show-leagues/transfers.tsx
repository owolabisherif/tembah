import useDateInterpretation from '@/hooks/use-date-interpretation';
import { usePlaceholderImage } from '@/hooks/user-placeholder-image';
import { cn } from '@/lib/utils';
import useLeagueStore from '@/stores/use-league-store';
import { SharedData } from '@/types';
import { League } from '@/types/match';
import { Link, usePage } from '@inertiajs/react';
import i18next, { t } from 'i18next';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { PropsWithChildren, useEffect } from 'react';

export default function Transfers({ ...props }: PropsWithChildren<League>) {
    const { id, leagueId, season } = props;
    const currentSeason = usePage<SharedData>().props.currentSeason;
    const { leagues, loading, initLeague, updateTransferData } = useLeagueStore();

    useEffect(() => {
        if (leagueId) {
            initLeague(leagueId);
            getData();
        }
    }, [season]);

    const getData = async () => updateTransferData(leagueId);

    return (
        <div className="overflow-x-auto rounded-sm pt-5 shadow-sm">
            {!loading && leagues[leagueId]?.transfers?.length ? (
                <table className="table w-full table-auto transition-all">
                    <thead>
                        <tr>
                            <th className={cn('pb-1 text-xs', i18next.language == 'en' ? 'pl-3 text-left' : 'pr-3 text-right')}>#</th>
                            <th className={cn('pb-1 text-xs', i18next.language == 'en' ? 'text-left' : 'text-right')}>{t('Player')}</th>
                            <th className={cn('pb-1 text-xs', i18next.language == 'en' ? 'text-left' : 'text-right')}>{t('Fee')}</th>
                            <th className={cn('pb-1 text-xs', i18next.language == 'en' ? 'text-left' : 'text-right')}>{t('Type')}</th>
                            <th className={cn('pb-1 text-xs', i18next.language == 'en' ? 'text-left' : 'text-right')}>{t('From')}</th>
                            <th className={cn('pb-1 text-xs', i18next.language == 'en' ? 'text-left' : 'text-right')}>{t('Position')}</th>
                            <th className={cn('pb-1 text-xs', i18next.language == 'en' ? 'text-left' : 'text-right')}>{t('Date')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leagues[leagueId]?.transfers.map((item, index) => (
                            <tr className={cn('w-full cursor-pointer hover:bg-gray-200')} key={`${item.id}-${index}`}>
                                <td className={cn('border-b border-gray-100 py-3 text-xs font-bold', i18next.language == 'en' ? 'pl-3' : 'pr-3')}>
                                    {index + 1}
                                </td>
                                <td className="border-b border-gray-100 py-3 text-xs font-bold whitespace-nowrap">
                                    <div className="flex w-full items-center gap-x-3">
                                        <div className="h-10 w-10 overflow-hidden rounded-full border border-gray-200">
                                            <img
                                                src={item.image ? item.image : usePlaceholderImage()}
                                                alt={item.name}
                                                className="h-full w-full object-contain"
                                            />
                                        </div>
                                        <div className="flex flex-1 flex-col justify-start">
                                            <Link
                                                href={route('show.player', {
                                                    slug: item.slug,
                                                    shirt: 0,
                                                    player: item.id,
                                                })}
                                                className="mb-1 hover:underline"
                                            >
                                                {i18next.language == 'en' ? item.name : item.nameAr}
                                            </Link>
                                            <Link
                                                className="flex items-center gap-x-2 hover:underline"
                                                href={route('soccer.show.team.index', {
                                                    slug: item.to.slug,
                                                    ids: `${item.to.id}`,
                                                })}
                                            >
                                                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500">
                                                    {i18next.language == 'en' ? (
                                                        <ArrowRightIcon className="size-3" />
                                                    ) : (
                                                        <ArrowLeftIcon className="size-3" />
                                                    )}
                                                </div>
                                                <div className="h-6 w-6 overflow-hidden rounded-full border border-gray-200">
                                                    <img
                                                        src={item.to.image ? item.to.image : usePlaceholderImage()}
                                                        alt={item.to.name}
                                                        className="h-full w-full object-contain"
                                                    />
                                                </div>
                                                <p>{i18next.language == 'en' ? item.to.name : item.to.nameAr}</p>
                                            </Link>
                                        </div>
                                    </div>
                                </td>
                                <td className="border-b border-gray-100 py-3 text-xs font-bold">{item.price ?? '-'}</td>
                                <td className="border-b border-gray-100 py-3 text-xs font-bold">
                                    {i18next.language == 'en' ? item.type : item.typeAr}
                                </td>
                                <td className="border-b border-gray-100 py-3 text-xs font-bold">
                                    <Link
                                        className="flex items-center gap-x-3 hover:underline"
                                        href={route('soccer.show.team.index', {
                                            slug: item.from.slug,
                                            ids: `${item.from.id}`,
                                        })}
                                    >
                                        <div className="h-6 w-6 overflow-hidden rounded-full border border-gray-200">
                                            <img
                                                src={item.from.image ? item.from.image : usePlaceholderImage()}
                                                alt={item.from.name}
                                                className="h-full w-full object-contain"
                                            />
                                        </div>
                                        <p>{i18next.language == 'en' ? item.from.name : item.from.nameAr}</p>
                                    </Link>
                                </td>
                                <td className="border-b border-gray-100 py-3 text-xs font-bold">{item.position != '' ? item.position : 'N/A'}</td>
                                <td className="border-b border-gray-100 py-3 text-xs font-bold">{useDateInterpretation(item.date)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="flex h-full w-full items-center justify-center">
                    <h3 className="font-bold">{t('No information to show. Please try again.')}</h3>
                </div>
            )}
        </div>
    );
}
