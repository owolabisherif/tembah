import MatchCardLoader from '@/components/match-card-loader';
import SlickSlider from '@/components/slick-slider';
import ViewAllButton from '@/components/ui/view-all-button';
import { useIsMobile } from '@/hooks/use-mobile';
import { News } from '@/types/news';
import axios from 'axios';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import RecentStoriesTab from './recent-stories-tab';

export default function Articles() {
    const [articles, setArticles] = useState<News[]>([]);
    const [loading, setLoading] = useState(false);
    const isMobile = useIsMobile();

    useEffect(() => {
        getTrendingNews();
    }, []);

    const getTrendingNews = async () => {
        try {
            setArticles([]);
            setLoading(true);
            const res = await axios.get(route('home.articles.index'));

            setArticles(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {!loading && articles.length ? (
                <div className="mt-5 mb-5 md:mb-10">
                    <div className="mb-2 flex items-center justify-between">
                        <h1 className="text-lg font-bold text-black dark:text-white">{t('Articles')}</h1>
                        <ViewAllButton href={route('article.news.index')} />
                    </div>
                    <SlickSlider showArrow={!isMobile && true} autoplay={false} initialSlide={0}>
                        {articles.map((item) => (
                            <div className="px-0 md:px-2" key={item.title}>
                                <RecentStoriesTab news={item} layout="ver" type="articles" page={null} />
                            </div>
                        ))}
                    </SlickSlider>
                </div>
            ) : loading ? (
                <SlickSlider showArrow={false} autoplay={true} initialSlide={0}>
                    {Array.from({ length: 9 }).map((item, index) => (
                        <div className="col-span-4 mt-5 px-2" key={index}>
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
