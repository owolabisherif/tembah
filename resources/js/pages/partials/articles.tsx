import ArticleCard from '@/components/article-card';
import SlickSlider from '@/components/slick-slider';
import Article from '@/types/article';
import { ChevronRight } from 'lucide-react';

export default function Articles() {
    var matches: Article[] = [
        {
            title: 'Hello article',
            author: {
                name: 'First Author',
                imageUrl: '/assets/others/image1.jpg',
            },
            body: 'Article body',
            imageUrl: '/assets/others/image1.jpg',
            tags: '#o #n #e',
            date: '7-05-2025',
            time: '20 hr',
            type: 'image',
        },
        {
            title: 'Hello article',
            author: {
                name: 'First Author',
                imageUrl: '/assets/others/image1.jpg',
            },
            body: 'Article body',
            imageUrl: '/assets/others/image1.jpg',
            tags: '#o #n #e',
            date: '7-05-2025',
            time: '20 hr',
            type: 'image',
        },
        {
            title: 'Hello article',
            author: {
                name: 'First Author',
                imageUrl: '/assets/others/image1.jpg',
            },
            body: 'Article body',
            imageUrl: '/assets/others/image1.jpg',
            tags: '#o #n #e',
            date: '7-05-2025',
            time: '20 hr',
            type: 'image',
        },
        {
            title: 'Hello article',
            author: {
                name: 'First Author',
                imageUrl: '/assets/others/image1.jpg',
            },
            body: 'Article body',
            imageUrl: '/assets/others/image1.jpg',
            tags: '#o #n #e',
            date: '7-05-2025',
            time: '20 hr',
            type: 'image',
        },
        {
            title: 'Hello article',
            author: {
                name: 'First Author',
                imageUrl: '/assets/others/image1.jpg',
            },
            body: 'Article body',
            imageUrl: '/assets/others/image1.jpg',
            tags: '#o #n #e',
            date: '7-05-2025',
            time: '20 hr',
            type: 'image',
        },
    ];
    return (
        <div className="mb-10">
            <div className="flex items-center justify-between">
                <h1 className="mt-5 mb-3 text-lg font-bold text-black">Articles</h1>
                <div className="flex items-center">
                    <p className="text-xs font-black">View all</p>
                    <ChevronRight className="w-3" />
                </div>
            </div>
            <SlickSlider showArrow={true} autoplay={false}>
                {matches.map((item) => (
                    <div className="px-2" key={item.title}>
                        <ArticleCard {...item} />
                    </div>
                ))}
            </SlickSlider>
        </div>
    );
}
