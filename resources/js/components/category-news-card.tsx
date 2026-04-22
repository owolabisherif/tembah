import { cn } from '@/lib/utils';
import { CategoryNewsType } from '@/pages/partials/category-news';
import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { PropsWithChildren } from 'react';

export default function CategoryNewsCard({ children, ...props }: PropsWithChildren<CategoryNewsType>) {
    const { id, title, url, news } = props;

    return (
        <>
            <div className={cn('mb-5 flex items-baseline justify-between rounded-sm bg-blue-950 px-1.5 py-1')}>
                <h1 className="text-sm font-bold text-white">{title}</h1>
                <div className="flex items-center">
                    <Link className="text-xs text-white" href={url}>
                        View all
                    </Link>
                    <ChevronRight className="w-3 text-white" />
                </div>
            </div>
            <div className="grid grid-cols-12 gap-5">
                {news.map((item) => (
                    <div className="col-span-3" key={item.id}>
                        <div className="flex w-full flex-col gap-x-3">
                            <div className="mb-1 h-32 w-full overflow-hidden rounded-sm">
                                <img src={item.imageUrl} alt={title} className="h-full w-full object-cover object-center" />
                            </div>
                            <div className="flex h-24 flex-1 flex-col overflow-hidden px-2">
                                <div className="mb-2 flex justify-between text-xs">
                                    {item.club && (
                                        <h3 className="text-gray-400">
                                            {item.club} • {item.time}
                                        </h3>
                                    )}
                                    {item.date && <h3 className="text-gray-400">{item.date}</h3>}
                                </div>
                                <div className="flex h-full flex-col justify-between">
                                    <p className="mb-5 items-start text-xs font-black">{item.title}</p>
                                    {item.tags && <p className="text-xs">{item.tags}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
