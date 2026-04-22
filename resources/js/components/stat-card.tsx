import { usePlaceholderImage } from '@/hooks/user-placeholder-image';
import { cn } from '@/lib/utils';
import { StatCardType } from '@/types/match';
import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { Badge } from './ui/badge';

export default function StatCard({ title, payload }: StatCardType) {
    return (
        <div className="rounded-sm p-3 shadow-sm">
            <Link className="mb-5 flex justify-between hover:text-blue-950" href="#">
                <h2 className="text-lg font-bold">{title}</h2>
                <div className="flex items-center">
                    <p className="text-xs font-bold">See All</p>
                    <ChevronRight className="size-4 font-bold" />
                </div>
            </Link>
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
                                <div className="mr-2 h-10 w-10 overflow-hidden rounded-full border border-gray-400">
                                    <img src={item.player.image ?? usePlaceholderImage()} alt={item.player.name} className="h-full w-full" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold">{item.player.name}</h3>
                                    <div className="flex items-center">
                                        <div className="mr-2 h-4 w-4 overflow-hidden rounded-full border border-gray-300">
                                            <img
                                                src={item.team.logo ?? usePlaceholderImage()}
                                                alt={item.team.name}
                                                className="h-full w-full object-cover object-center"
                                            />
                                        </div>
                                        <h3 className="text-xs text-gray-400">{item.team.name}</h3>
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
