import GuestLayout from '@/layouts/guest-layout';
import { BreadcrumbItem } from '@/types';
import { News } from '@/types/news';
import { useElementVisibility } from '@reactuses/core';

import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import RecentStoriesTab from './partials/recent-stories-tab';

export default function NewsShowTrending() {
    const ref = useRef<HTMLDivElement>(null);
    const root = useRef(null);
    const [allNews, updateAllNews] = useState<News[]>([]);
    const [nextPage, setNextPage] = useState<string | null>();
    const [prevPage, setPrevPage] = useState<string | null>();
    const [visible, stop] = useElementVisibility(ref);

    useEffect(() => {
        return () => {
            stop();
        };
    }, []);

    const getNews = async (url: string | null) => {
        const res = await axios.get(url ?? route('trending.news.show'));

        setNextPage(res.data.next_page_url);
        setPrevPage(res.data.prev_page_url);

        updateAllNews([...allNews, ...res.data.data]);
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Home',
            href: route('home'),
        },
        {
            title: 'Trending News',
            href: '#',
        },
    ];

    useEffect(() => {
        getNews(null);
    }, []);

    useEffect(() => {
        if (!allNews.length) return;

        if (visible && nextPage) {
            getNews(nextPage);
        }
    }, [visible, allNews]);

    return (
        <GuestLayout title="Trending News" breadcrumbs={breadcrumbs}>
            {Boolean(allNews.length) ? (
                <>
                    <div className="mb-10 grid grid-cols-12 gap-5">
                        {allNews.map((item) => (
                            <div className="col-span-3" key={item.slug}>
                                <RecentStoriesTab news={item} layout="ver" />
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div>
                    <p>No news to show, check back again.</p>
                </div>
            )}
            <div ref={ref} className="h-3 w-full bg-transparent"></div>
        </GuestLayout>
    );
}
