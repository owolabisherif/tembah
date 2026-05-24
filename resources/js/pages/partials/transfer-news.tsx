import ShareButtons from '@/components/ui/share_buttons';
import ViewAllButton from '@/components/ui/view-all-button';
import useStripHTML from '@/hooks/use-strip-html';
import { usePlaceholderImage } from '@/hooks/user-placeholder-image';
import { cn } from '@/lib/utils';
import { News } from '@/types/news';
import { Link } from '@inertiajs/react';
import { Popover, PopoverAnchor, PopoverArrow, PopoverContent, PopoverPortal, PopoverTrigger } from '@radix-ui/react-popover';
import axios from 'axios';
import i18next, { t } from 'i18next';
import { MoreVerticalIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import RecentStoriesTab from './recent-stories-tab';

export default function TransferNews() {
    const [selected, setSelected] = useState(0);
    const [loading, setLoading] = useState(false);
    const [news, setNews] = useState<News[]>([]);

    useEffect(() => {
        getNews();
    }, []);

    const getNews = async () => {
        try {
            setLoading(true);
            const res = await axios.get(route('home.transfer-news'));
            setNews(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    var total: number = 0;
    var actutalTotal: number = 0;
    var timeout: ReturnType<typeof setTimeout> | undefined | null;

    const handleSetTimeout = () => {
        // timeout = setTimeout(() => {

        // }, 600);

        // if (total < actutalTotal) {
        //     total++;
        // } else {
        //     total--;
        // }

        if (selected === news.length - 1) {
            setSelected(0);
        } else {
            setSelected((n) => n + 1);
        }
        // setSelected(total);

        setTimeout(handleSetTimeout, 600);
    };

    useEffect(() => {
        total = actutalTotal = news.length - 1;
        setSelected(0);
        // handleSetTimeout();
    }, []);

    window.addEventListener('close', () => {
        clearTimeout(timeout!);
        timeout = null;
    });

    const handleSelected = (index: number) => {
        // clearTimeout(timeout!);
        // timeout = null;
        setSelected(index);
    };

    return (
        <>
            {Boolean(news.length) && (
                <div className="mb-3 flex items-baseline justify-between">
                    <h1 className="text-lg font-bold text-black dark:text-white">{t('Transfer News')}</h1>
                    <ViewAllButton href={route('transfer.news.index')} />
                </div>
            )}
            <div className="mb-0 flex w-full flex-row gap-x-2 md:mb-5">
                {!loading && news.length ? (
                    <>
                        <div className="flex flex-1 flex-col">
                            <div
                                style={{ '--image-url': `url(${news[0].images[0].name})` } as any}
                                className={cn(
                                    'mb-1 w-full animate-fadein rounded-sm bg-gray-500 bg-[image:var(--image-url)] bg-cover bg-center transition-all',
                                    news.length > 3 ? 'flex-1' : 'h-56 md:h-96',
                                )}
                            ></div>
                            <div className="flex flex-col overflow-hidden py-2">
                                <div className="mb-2">
                                    <Link
                                        href={route('show.news', { type: 'transfer', slug: news[0].slug })}
                                        className="line-clamp-2 text-start text-lg font-black hover:underline"
                                    >
                                        {i18next.language == 'en' ? news[0].title : news[0].title_ar}
                                    </Link>
                                </div>
                                <p className="mb-5 line-clamp-2">
                                    {i18next.language == 'en' ? useStripHTML(news[0].body!) : useStripHTML(news[0].body_ar!)}
                                </p>
                                <div className="flex justify-between">
                                    <div className="flex h-fit w-full items-center gap-x-1">
                                        <div className="h-6 w-6 overflow-hidden rounded-full bg-gray-100">
                                            <img
                                                src={news[0]?.author ? news[0].author?.image?.name : usePlaceholderImage()}
                                                alt={news[0].title}
                                                className="h-full w-full object-cover object-center"
                                            />
                                        </div>
                                        <p className="text-xs">
                                            {news[0]?.author?.name ?? 'Tembah'} • {news[0].created_at}
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
                                                        news={news[0]}
                                                        url={route('show.news', { type: 'transfer', slug: news[0].slug })}
                                                        className="flex w-full gap-x-2 rounded-md bg-white p-2 shadow-md"
                                                    />
                                                    <PopoverArrow className="PopoverArrow" />
                                                </PopoverContent>
                                            </PopoverPortal>
                                        </Popover>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {news.length > 3 && (
                            <div className="hidden h-full w-80 overflow-hidden rounded-sm md:flex">
                                <div className="grid grid-cols-12 gap-5">
                                    {news.map((item, index) => (
                                        <div
                                            className={cn(
                                                'col-span-12 block cursor-pointer rounded-sm pr-2 transition-all hover:bg-gray-200',
                                                index == selected && 'bg-gray-200',
                                            )}
                                            key={item.id}
                                        >
                                            <RecentStoriesTab news={item} layout="hor" type="transfer" page={null} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                ) : loading ? (
                    <>
                        <div className="flex flex-1 flex-col">
                            <div className={cn('mb-1 flex-1 animate-pulse rounded-sm bg-gray-200 bg-cover bg-center transition-all')}></div>
                            <div className="flex flex-col overflow-hidden py-2">
                                <div className="mb-5 rounded-full bg-gray-300"></div>
                                <div className="flex justify-between">
                                    <div className="flex h-fit w-full flex-1 items-center gap-x-1">
                                        <div className="h-8 w-8 rounded-full bg-gray-100"></div>
                                        <p className="text-xs text-gray-100">Tembah • 1 hour ago</p>
                                    </div>
                                    <div className="h-2 rounded-full">
                                        <MoreVerticalIcon className="w-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="hidden h-full w-80 overflow-hidden rounded-sm md:flex">
                            <div className="grid grid-cols-12 gap-5">
                                {Array.from({ length: 3 }).map((item, index) => (
                                    <div className="col-span-12 flex w-full animate-pulse flex-row gap-x-3" key={index}>
                                        <div className="mb-1 h-32 w-32 overflow-hidden rounded-sm bg-gray-300"></div>
                                        <div className="flex h-24 flex-1 flex-col overflow-hidden">
                                            <div className="mb-3 h-2 w-full rounded-full bg-gray-100"></div>
                                            <div className="flex justify-between">
                                                <div className="flex h-fit w-full flex-1 items-center gap-x-1">
                                                    <div className="h-8 w-8 rounded-full bg-gray-100"></div>
                                                    <p className="text-xs text-gray-100">Tembah • 1 hour ago</p>
                                                </div>
                                                <div className="rounded-full">
                                                    <MoreVerticalIcon className="w-4 text-gray-100" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <div></div>
                )}
            </div>
        </>
    );
}
