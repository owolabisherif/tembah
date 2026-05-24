import MatchCardLoader from '@/components/match-card-loader';
import ViewAllButton from '@/components/ui/view-all-button';
import { useIsMobile } from '@/hooks/use-mobile';
import { News } from '@/types/news';
import axios from 'axios';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import LiveMatch from './live-match';
import RecentStoriesTab from './recent-stories-tab';
import TransferNews from './transfer-news';
import TrendingNews from './trending-news';

type LatestNewsType = {
    news: News[];
};

export default function LatestNews() {
    const [news, setNews] = useState<News[]>([]);
    const [loading, setLoading] = useState(false);
    const isMobile = useIsMobile();
    useEffect(() => {
        getNews();
    }, [isMobile]);

    const getNews = async () => {
        try {
            setLoading(true);
            const res = await axios.get(route('home.latest-news', { limit: isMobile ? 3 : 9 }));
            setNews(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="mt-5 grid grid-cols-12 gap-x-2">
                <div className="col-span-12 h-full flex-1 overflow-hidden rounded-sm md:col-span-9">
                    <div className="col-span-9">
                        <div className="mb-5 flex items-baseline justify-between">
                            <h1 className="text-lg font-bold text-black dark:text-white">{t('News')}</h1>
                            <ViewAllButton href={route('text.news.index')} />
                        </div>
                    </div>
                    <div className="grid grid-cols-12 gap-5">
                        {!loading && news.length ? (
                            <>
                                {news?.map((item) => (
                                    <div className="col-span-12 block cursor-pointer rounded-sm md:col-span-4" key={item.id}>
                                        <RecentStoriesTab news={item} layout="ver" page={null} />
                                    </div>
                                ))}
                            </>
                        ) : loading ? (
                            Array.from({ length: isMobile ? 3 : 9 }).map((item, index) => (
                                <div className={isMobile ? 'col-span-12' : 'col-span-4'} key={index}>
                                    <MatchCardLoader type="news" />
                                </div>
                            ))
                        ) : (
                            <div></div>
                        )}

                        <div className="col-span-12">
                            <TransferNews />
                        </div>
                        <div className="col-span-12">
                            <TrendingNews />
                        </div>
                    </div>
                </div>

                <div className="col-span-3 hidden overflow-hidden md:block">
                    <LiveMatch />
                </div>
            </div>
        </>
    );
}
