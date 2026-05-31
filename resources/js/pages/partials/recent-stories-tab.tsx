import ShareButtons from '@/components/ui/share_buttons';
import { usePlaceholderImage } from '@/hooks/user-placeholder-image';
import { cn } from '@/lib/utils';
import { News } from '@/types/news';
import { Link } from '@inertiajs/react';
import { Popover, PopoverAnchor, PopoverArrow, PopoverContent, PopoverPortal, PopoverTrigger } from '@radix-ui/react-popover';
import i18next, { t } from 'i18next';
import { MoreVerticalIcon } from 'lucide-react';

type StoriesTabProp = {
    news: News;
    layout?: 'hor' | 'ver';
    type?: string;
    page: string | null;
};

export default function RecentStoriesTab({ news, layout = 'hor', type = 'all', page }: StoriesTabProp) {
    return (
        <>
            {layout == 'hor' ? (
                <div className="flex h-fit gap-x-3 gap-y-4">
                    <div className="relative h-24 w-24 overflow-hidden rounded-sm">
                        {news.images && news.images.length ? (
                            <img src={news.images[0]?.name} alt={news.title} className="h-full w-full object-cover object-center md:object-fill" />
                        ) : (
                            <div></div>
                        )}
                        {Boolean(news.images.length > 1 && news.type != 'video') && (
                            <div className="absolute right-2 bottom-2 h-8 w-8 overflow-hidden rounded-sm shadow-sm shadow-white">
                                <div
                                    data-count={`+ ${news.images.length - 1}`}
                                    className={cn(
                                        'relative h-full w-full',
                                        'after:absolute after:inset-0 after:flex after:items-center after:justify-center after:bg-black/40 after:text-xs after:font-bold after:text-white after:content-[attr(data-count)]',
                                    )}
                                >
                                    <div className="absolute inset-0">
                                        <img src={news.images[1]?.name} alt={news.title} className="h-full w-full object-cover object-center" />
                                    </div>
                                </div>
                            </div>
                        )}
                        {news.type == 'video' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <div className="flex w-full items-center justify-center">
                                    <div className="size-5 md:size-10">
                                        <img src="/assets/icons/playbtn.png" alt="" className="h-full w-full object-contain" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-1 flex-col overflow-hidden p-2">
                        <div className="flex-1">
                            <Link
                                href={
                                    page
                                        ? route('show.news.cat-tag', { type: type, slug: news.slug, page: page })
                                        : route('show.news', { type: type, slug: news.slug })
                                }
                                className="line-clamp-2 text-start text-sm font-black hover:underline"
                                dir={i18next.dir()}
                            >
                                {i18next.language == 'en' ? news.title : news.title_ar}
                            </Link>
                        </div>
                        <div className="flex justify-between" dir={i18next.dir()}>
                            <div className="flex h-fit w-full flex-1 items-center gap-x-1">
                                <div className="h-6 w-6 overflow-hidden rounded-full bg-gray-100">
                                    <img
                                        src={news?.author?.image ? news?.author?.image.name : usePlaceholderImage()}
                                        alt={news.title}
                                        className="h-full w-full object-cover object-center"
                                    />
                                </div>
                                <p className="text-xs">
                                    {news?.author ? (i18next.language == 'en' ? news?.author?.name : news?.author?.name_ar) : t('Tembah')} •
                                    {news.created_at}
                                </p>
                            </div>
                            <div className="h-2 rounded-full">
                                <Popover>
                                    <PopoverTrigger className="cursor-pointer rounded-full p-0.5 hover:bg-gray-100">
                                        <MoreVerticalIcon className="w-4" />
                                    </PopoverTrigger>
                                    <PopoverAnchor />
                                    <PopoverPortal>
                                        <PopoverContent>
                                            <ShareButtons
                                                news={news}
                                                url={
                                                    page
                                                        ? route('show.news.cat-tag', { type: type, slug: news.slug, page: page })
                                                        : route('show.news', { type: type, slug: news.slug })
                                                }
                                                className="flex w-full flex-col gap-y-2 rounded-md bg-white p-2 shadow-md"
                                            />
                                            <PopoverArrow className="PopoverArrow" />
                                        </PopoverContent>
                                    </PopoverPortal>
                                </Popover>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex h-full w-full flex-col gap-x-3 overflow-hidden rounded-sm shadow-sm">
                    <div className="relative mb-1 h-44 w-full overflow-hidden rounded-sm">
                        {news.images && news.images.length ? (
                            <img src={news.images[0]?.name} alt={news.title} className="h-full w-full object-cover object-center md:object-fill" />
                        ) : (
                            <div></div>
                        )}
                        {Boolean(news.images.length > 1 && news.type != 'video') && (
                            <div className="absolute right-2 bottom-2 h-10 w-10 overflow-hidden rounded-sm shadow-sm shadow-white">
                                <div
                                    data-count={`+ ${news.images.length - 1}`}
                                    className={cn(
                                        'relative h-full w-full',
                                        'after:absolute after:inset-0 after:flex after:items-center after:justify-center after:bg-black/40 after:text-xs after:font-bold after:text-white after:content-[attr(data-count)]',
                                    )}
                                >
                                    <div className="absolute inset-0">
                                        <img src={news.images[1]?.name} alt={news.title} className="h-full w-full object-cover object-center" />
                                    </div>
                                </div>
                            </div>
                        )}
                        {news.type == 'video' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <div className="flex w-full items-center justify-center">
                                    <div className="h-15 w-15">
                                        <img src="/assets/icons/playbtn.png" alt="" className="h-full w-full object-contain" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-1 flex-col overflow-hidden p-2">
                        <div className="mb-5 flex-1">
                            <Link
                                href={
                                    page
                                        ? route('show.news.cat-tag', { type: type, slug: news.slug, page: page })
                                        : route('show.news', { type: type, slug: news.slug })
                                }
                                className="line-clamp-2 text-start text-sm font-black hover:underline"
                                dir={i18next.dir()}
                            >
                                {i18next.language == 'en' ? news.title : news.title_ar}
                            </Link>
                        </div>
                        <div className="flex justify-between" dir={i18next.dir()}>
                            <div className="flex h-fit w-full flex-1 items-center gap-x-1">
                                <div className="h-6 w-6 overflow-hidden rounded-full bg-gray-100">
                                    <img
                                        src={news?.author?.image ? news?.author?.image?.name : usePlaceholderImage()}
                                        alt={news.title}
                                        className="h-full w-full object-cover object-center"
                                    />
                                </div>
                                <p className="flex-1 text-xs">
                                    {news?.author ? (i18next.language == 'en' ? news?.author?.name : news?.author?.name_ar) : t('Tembah')} •
                                    {news.created_at}
                                </p>
                            </div>
                            <div className="flex h-2 rounded-full">
                                <Popover>
                                    <PopoverTrigger className="flex cursor-pointer rounded-full p-0.5 hover:bg-gray-100">
                                        <MoreVerticalIcon className="w-4" />
                                    </PopoverTrigger>
                                    <PopoverAnchor />
                                    <PopoverPortal>
                                        <PopoverContent>
                                            <ShareButtons
                                                news={news}
                                                url={
                                                    page
                                                        ? route('show.news.cat-tag', { type: type, slug: news.slug, page: page })
                                                        : route('show.news', { type: type, slug: news.slug })
                                                }
                                                className="flex w-full flex-col gap-y-2 rounded-md bg-white p-2 shadow-md"
                                            />
                                        </PopoverContent>
                                    </PopoverPortal>
                                </Popover>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
