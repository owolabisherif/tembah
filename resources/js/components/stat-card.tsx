import { usePlaceholderImage } from '@/hooks/user-placeholder-image';
import { cn } from '@/lib/utils';
import { StatCardType } from '@/types/match';
import { Link } from '@inertiajs/react';
import i18next from 'i18next';
import { Badge } from './ui/badge';

export default function StatCard({ title, payload, leagueId }: StatCardType) {
    return (
        <div className="rounded-sm p-3 shadow-sm">
            <h2 className="text-lg font-bold">{title}</h2>
            <div>
                {payload.length &&
                    payload.map((item, index) => (
                        <div
                            className={cn(
                                'flex items-center justify-between py-3',
                                payload.length - 1 != index ? 'border-b border-b-gray-400/25' : '',
                            )}
                            key={item.player.name}
                        >
                            <div className="flex items-center justify-center">
                                <div
                                    className={cn(
                                        'h-10 w-10 overflow-hidden rounded-full border border-gray-400',
                                        i18next.language == 'en' ? 'mr-2' : 'ml-2',
                                    )}
                                >
                                    <img src={item.player.image ?? usePlaceholderImage()} alt={item.player.name} className="h-full w-full" />
                                </div>
                                <div>
                                    <Link
                                        href={route('show.player', {
                                            slug: item.player.slug,
                                            shirt: item.player.shirt,
                                            player: item.player.id,
                                        })}
                                        className="mb-1 hover:underline"
                                    >
                                        <h3 className="text-sm font-bold">{i18next.language == 'en' ? item.player.name : item.player.nameAr}</h3>
                                    </Link>
                                    <div className="flex items-center">
                                        <div className="mr-2 h-4 w-4 overflow-hidden rounded-full border border-gray-300">
                                            <img
                                                src={item.team.logo ?? usePlaceholderImage()}
                                                alt={item.team.name}
                                                className="h-full w-full object-cover object-center"
                                            />
                                        </div>
                                        <Link
                                            href={route('soccer.show.team.index', {
                                                slug: item.team.slug,
                                                ids: leagueId ? `${item.team.id}-${leagueId}` : item.team.id,
                                            })}
                                            className="hover:underline"
                                        >
                                            <h3 className="text-xs text-gray-400">{i18next.language == 'en' ? item.team.name : item.team.nameAr}</h3>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <Badge className={cn('rounded-full text-sm', index == 0 ? 'bg-red-500 text-white' : 'bg-transparent text-black')}>
                                <h3 className="font-bold">{item.value}</h3>
                            </Badge>
                        </div>
                    ))}
            </div>
        </div>
    );
}
