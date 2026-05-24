import { usePlaceholderImage } from '@/hooks/user-placeholder-image';
import { cn } from '@/lib/utils';
import { League, Standing } from '@/types/match';
import { Link } from '@inertiajs/react';
import i18next from 'i18next';

export default function HomeStanding({ standings, league, ...props }: { standings: Standing[]; league: League }) {
    const getBorderColor = (standing: Standing) => {
        if (standing.inChampions) return 'border-green-600';
        if (standing.inEuropa) return 'border-blue-950';
        if (standing.inRelegation) return 'border-red-500';
        if (standing.inConference) return 'border-yellow-600';
    };

    return (
        <div className="">
            <div className="mb-5 flex items-center justify-between pt-5">
                <div className="flex-1">
                    <h3 className="font-bold">{i18next.language == 'en' ? league.name : league.nameAr}</h3>
                    <p className="text-gray-400 capitalize">{i18next.language == 'en' ? league.country?.name : league.country?.name_ar}</p>
                </div>

                <div className="h-10 w-10 overflow-hidden rounded-full border border-gray-100">
                    <img
                        src={league.logo != `${league.leagueId}.png` ? league.logo : usePlaceholderImage()}
                        alt={league.name}
                        className="h-full w-full"
                    />
                </div>
            </div>
            <table className="table w-full table-auto transition-all">
                <thead>
                    <tr>
                        <th className={cn('pb-1 text-xs', i18next.language == 'en' ? 'pl-5 text-left' : 'pr-5 text-right')}>#</th>
                        <th className={cn('pb-1 text-xs', i18next.language == 'en' ? 'text-left' : 'text-right')}></th>
                        <th className={cn('pb-1 text-xs', i18next.language == 'en' ? 'text-left' : 'text-right')}>PL</th>
                        <th className={cn('pb-1 text-xs', i18next.language == 'en' ? 'text-left' : 'text-right')}>GD</th>
                        <th className={cn('pb-1 text-xs', i18next.language == 'en' ? 'text-left' : 'text-right')}>PTS</th>
                    </tr>
                </thead>
                <tbody>
                    {standings.map((item, index) => (
                        <tr
                            className={cn(
                                'mb-1 w-full cursor-pointer hover:bg-gray-200',
                                getBorderColor(item),
                                i18next.language == 'en' ? 'border-l-3' : 'border-r-3',
                            )}
                            key={index}
                        >
                            <td
                                className={cn(
                                    'border-b border-gray-50 py-1.5 text-xs font-bold dark:border-neutral-700',
                                    i18next.language == 'en' ? 'pl-5' : 'pr-5',
                                )}
                            >
                                {index + 1}
                            </td>
                            <td className="border-b border-gray-50 py-1.5 text-xs font-bold whitespace-nowrap dark:border-neutral-700">
                                <div className="flex items-center gap-x-3">
                                    <div className="h-6 w-6 overflow-hidden rounded-full border border-gray-200">
                                        <img
                                            src={item.logo ? item.logo : usePlaceholderImage()}
                                            alt={item.name}
                                            className="h-full w-full object-contain"
                                        />
                                    </div>
                                    <Link
                                        href={route('soccer.show.team.index', {
                                            slug: item.name.replace('/', ' ').toLowerCase().split(' ').join('-'),
                                            ids: league ? `${item.id}-${league.leagueId}` : item.id,
                                        })}
                                        className="hover:underline"
                                    >
                                        <p>{i18next.language == 'en' ? item.name : item.nameAr}</p>
                                    </Link>
                                </div>
                            </td>
                            <td className="border-b border-gray-50 py-1.5 text-xs font-bold dark:border-neutral-700">{item.overall.gp}</td>
                            <td className="border-b border-gray-50 py-1.5 text-xs font-bold dark:border-neutral-700">{item.total.gd}</td>
                            <td className="border-b border-gray-50 py-1.5 text-xs font-bold dark:border-neutral-700">{item.total.p}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
