import { cn } from '@/lib/utils';
import { CategoryNewsType } from '@/pages/partials/category-news';
import RecentStoriesTab from '@/pages/partials/recent-stories-tab';
import { Link } from '@inertiajs/react';
import i18next, { t } from 'i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PropsWithChildren } from 'react';
import SlickSlider from './slick-slider';

export default function CategoryNewsCard({ children, ...props }: PropsWithChildren<CategoryNewsType>) {
    const { id, slug, slug_ar, title, title_ar, url, news } = props;

    return (
        <>
            <div className={cn('mb-5 flex items-baseline justify-between rounded-sm bg-blue-950 px-1.5 py-1')}>
                <h1 className="text-sm font-bold text-white capitalize">{i18next.language == 'en' ? title : title_ar}</h1>
                <div className="flex items-center">
                    <Link className="text-xs text-white" href={route('category.news.index', { slug: slug })}>
                        {t('View all')}
                    </Link>
                    {i18next.language == 'en' ? <ChevronRight className="w-3 text-white" /> : <ChevronLeft className="w-3 text-white" />}
                </div>
            </div>

            <SlickSlider showArrow={news.length > 3} autoplay={news.length > 3} initialSlide={0} infinite={news.length > 3}>
                {news.map((item) => (
                    <div className="col-span-12 block cursor-pointer rounded-sm px-1 hover:bg-gray-200" key={item.id}>
                        <RecentStoriesTab news={item} layout="ver" type={slug} page="categories" />
                    </div>
                ))}
            </SlickSlider>
        </>
    );
}
