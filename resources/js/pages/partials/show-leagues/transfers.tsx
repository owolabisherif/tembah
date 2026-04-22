import useDateInterpretation from '@/hooks/use-date-interpretation';
import { usePlaceholderImage } from '@/hooks/user-placeholder-image';
import { cn } from '@/lib/utils';
import useLeagueStore from '@/stores/use-league-store';
import { SharedData } from '@/types';
import { League } from '@/types/match';
import { Link, usePage } from '@inertiajs/react';
import { ArrowRightIcon } from 'lucide-react';
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
        <div className="rounded-sm pt-5 shadow-sm">
            {!loading && leagues[leagueId]?.transfers?.length ? (
                <table className="table w-full table-auto transition-all">
                    <thead>
                        <tr>
                            <th className="pb-1 pl-3 text-left text-xs">#</th>
                            <th className="pb-1 text-left text-xs">Player</th>
                            <th className="pb-1 text-left text-xs">Fee</th>
                            <th className="pb-1 text-left text-xs">Type</th>
                            <th className="pb-1 text-left text-xs">From</th>
                            <th className="pb-1 text-left text-xs">Position</th>
                            <th className="pb-1 text-left text-xs">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leagues[leagueId]?.transfers.map((item, index) => (
                            <tr className={cn('w-full cursor-pointer hover:bg-gray-200')} key={`${item.id}-${index}`}>
                                <td className="border-b border-gray-100 py-3 pl-3 text-xs font-bold">{index + 1}</td>
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
                                                    player: item.id,
                                                })}
                                                className="mb-1 hover:underline"
                                            >
                                                {item.name}
                                            </Link>
                                            <Link
                                                className="flex items-center gap-x-2"
                                                href={route('soccer.show.team.index', {
                                                    slug: item.to.slug,
                                                    ids: `${item.to.id}`,
                                                })}
                                            >
                                                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500">
                                                    <ArrowRightIcon className="size-3" />
                                                </div>
                                                <div className="h-6 w-6 overflow-hidden rounded-full border border-gray-200">
                                                    <img
                                                        src={item.to.image ? item.to.image : usePlaceholderImage()}
                                                        alt={item.to.name}
                                                        className="h-full w-full object-contain"
                                                    />
                                                </div>
                                                <p>{item.to.name}</p>
                                            </Link>
                                        </div>
                                    </div>
                                </td>
                                <td className="border-b border-gray-100 py-3 text-xs font-bold">{item.price ?? '-'}</td>
                                <td className="border-b border-gray-100 py-3 text-xs font-bold">{item.type}</td>
                                <td className="border-b border-gray-100 py-3 text-xs font-bold">
                                    <Link
                                        className="flex items-center gap-x-3"
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
                                        <p>{item.from.name}</p>
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
                    <h3 className="font-bold">Nothing to show, please check back.</h3>
                </div>
            )}
        </div>
    );
}
