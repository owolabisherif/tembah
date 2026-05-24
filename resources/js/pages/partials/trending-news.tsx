import MatchCardLoader from '@/components/match-card-loader';
import SlickSlider from '@/components/slick-slider';
import ViewAllButton from '@/components/ui/view-all-button';
import { News } from '@/types/news';
import axios from 'axios';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import RecentStoriesTab from './recent-stories-tab';

export default function TrendingNews() {
    const [news, setNews] = useState<News[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getTrendingNews();
    }, []);

    const getTrendingNews = async () => {
        try {
            setNews([]);
            setLoading(true);
            const res = await axios.get(route('home.trending.news'));

            setNews(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            {!loading && news.length ? (
                <div className="mb-5 md:mb-10">
                    <div className="mb-2 grid grid-cols-12 gap-x-2">
                        <h1 className="col-span-9 text-lg font-bold text-black dark:text-white">{t('Trending News')}</h1>
                        <div className="col-span-3 flex justify-end">
                            <ViewAllButton href={route('trending.news.index')} />
                        </div>
                    </div>
                    <SlickSlider showArrow={false} autoplay={news.length > 3} infinite={news.length > 3} initialSlide={0}>
                        {news.map((item) => (
                            <div className="col-span-4 block cursor-pointer rounded-sm px-1" key={item.id}>
                                <RecentStoriesTab news={item} layout="ver" type="trending" page={null} />
                            </div>
                        ))}
                    </SlickSlider>
                </div>
            ) : loading ? (
                <SlickSlider showArrow={false} autoplay={true} initialSlide={0}>
                    {Array.from({ length: 9 }).map((item, index) => (
                        <div className="col-span-4 px-1" key={index}>
                            <MatchCardLoader type="news" />
                        </div>
                    ))}
                </SlickSlider>
            ) : (
                <div></div>
            )}
        </>
    );
}
