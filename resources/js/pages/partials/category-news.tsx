import CategoryNewsCard from '@/components/category-news-card';
import MatchCardLoader from '@/components/match-card-loader';
import { cn } from '@/lib/utils';
import { News } from '@/types/news';
import axios from 'axios';
import { useEffect, useState } from 'react';
import AllLeagues from './all-leagues';

export interface CategoryNewsType {
    id: number;
    slug: string;
    slug_ar: string;
    title: string;
    title_ar: string;
    url: string;
    news: News[];
}

export default function CategoryNews() {
    const [category, setCategory] = useState<CategoryNewsType[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getNews();
    }, []);

    const getNews = async () => {
        try {
            setCategory([]);
            setLoading(true);
            const res = await axios.get(route('home.category.index'));

            setCategory(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="grid grid-cols-12 gap-x-2">
                {!loading && category.length ? (
                    <div className="col-span-9 w-full">
                        {category.map((item, index) => (
                            <div className={cn(index != 0 && 'mt-10')} key={item.id}>
                                <CategoryNewsCard {...item} />
                            </div>
                        ))}
                    </div>
                ) : loading ? (
                    <div className="col-span-9 w-full">
                        <div className="grid grid-cols-12 gap-x-2">
                            <div className="col-span-12 mb-2 h-4 animate-pulse rounded-sm bg-gray-200"></div>
                            {Array.from({ length: 6 }).map((item, index) => (
                                <div className="col-span-4" key={index}>
                                    <MatchCardLoader type="news" />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <></>
                )}

                <div className={cn('overflow-y-auto p-0', category.length == 0 && !loading ? 'col-span-12' : 'col-span-3 h-full')}>
                    <AllLeagues />
                </div>
            </div>
        </>
    );
}
