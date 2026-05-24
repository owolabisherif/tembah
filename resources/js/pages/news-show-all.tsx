import GuestLayout from '@/layouts/guest-layout';
import { BreadcrumbItem } from '@/types';
import { News } from '@/types/news';
import { useElementVisibility } from '@reactuses/core';

import axios from 'axios';
import { t } from 'i18next';
import { useEffect, useRef, useState } from 'react';
import RecentStoriesTab from './partials/recent-stories-tab';

type NewsShowAllProp = {
    title: string;
    page: string;
    type: {
        text: string;
        page: string | null;
    };
};

export default function NewsShowAll({ type, page, title }: NewsShowAllProp) {
    const ref = useRef<HTMLDivElement>(null);
    const [showLoader, setShowLoader] = useState(false);
    const [loading, setLoading] = useState(false);
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
        try {
            setLoading(true);
            const res = await axios.get(url ?? page);
            setNextPage(res.data.next_page_url);
            setPrevPage(res.data.prev_page_url);

            updateAllNews([...allNews, ...res.data.data]);

            setShowLoader(false);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('Home'),
            href: route('home'),
        },
        {
            title: title,
            href: '#',
        },
    ];

    useEffect(() => {
        if (page) {
            getNews(null);
        }
    }, []);

    useEffect(() => {
        if (!allNews.length) return;

        if (visible && nextPage) {
            setShowLoader(true);
            getNews(nextPage);
        }
    }, [visible, allNews]);

    return (
        <GuestLayout title={type.text} breadcrumbs={breadcrumbs}>
            {Boolean(allNews.length) ? (
                <>
                    <div className="mb-10 grid grid-cols-12 gap-5">
                        {allNews.map((item) => (
                            <div className="col-span-12 md:col-span-3" key={item.slug}>
                                <RecentStoriesTab news={item} layout="ver" type={type.text} page={type.page} />
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div ref={ref} className="flex h-3 w-full justify-center bg-transparent">
                    <div className="loader"></div>
                </div>
            )}
            <div ref={ref} className="flex h-3 w-full justify-center bg-transparent">
                {showLoader && <div className="loader"></div>}
            </div>
        </GuestLayout>
    );
}
