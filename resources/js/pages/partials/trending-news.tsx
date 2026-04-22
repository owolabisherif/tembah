import SlickSlider from '@/components/slick-slider';
import { News } from '@/types/news';
import { ChevronRight } from 'lucide-react';
import RecentStoriesTab from './recent-stories-tab';

export default function TrendingNews() {
    const news: News[] = [
        {
            id: 1,
            title: "Mohamed Salah enters the 2025 Ballon d'Or race",
            imageUrl: '/assets/others/image1.jpg',
            club: 'Liverpool',
            time: '20mins',
            tags: '#MohamedSalah #Liverpool #Ballon',
            date: '20-5-2025',
            type: 'recent',
        },
        {
            id: 2,
            title: "Mohamed Salah enters the 2025 Ballon d'Or race",
            imageUrl: '/assets/others/image1.jpg',
            club: 'Liverpool',
            time: '20mins',
            tags: '#MohamedSalah #Liverpool #Ballon',
            date: '20-5-2025',
            type: 'top',
        },
        {
            id: 3,
            title: "Mohamed Salah enters the 2025 Ballon d'Or race",
            imageUrl: '/assets/others/image1.jpg',
            club: 'Liverpool',
            time: '20mins',
            tags: '#MohamedSalah #Liverpool #Ballon',
            date: '20-5-2025',
            type: 'recent',
        },
        {
            id: 4,
            title: "Mohamed Salah enters the 2025 Ballon d'Or race",
            imageUrl: '/assets/others/image1.jpg',
            club: 'Liverpool',
            time: '20mins',
            tags: '#MohamedSalah #Liverpool #Ballon',
            date: '20-5-2025',
            type: 'recent',
        },
        {
            id: 5,
            title: "Mohamed Salah enters the 2025 Ballon d'Or race",
            imageUrl: '/assets/others/image1.jpg',
            club: 'Liverpool',
            time: '20mins',
            tags: '#MohamedSalah #Liverpool #Ballon #Ballon',
            date: '20-5-2025',
            type: 'top',
        },
        {
            id: 6,
            title: "Mohamed Salah enters the 2025 Ballon d'Or race",
            imageUrl: '/assets/others/image1.jpg',
            club: 'Liverpool',
            time: '20mins',
            tags: '#MohamedSalah #Liverpool #Ballon #Ballon',
            date: '20-5-2025',
            type: 'top',
        },
        {
            id: 7,
            title: "Mohamed Salah enters the 2025 Ballon d'Or race",
            imageUrl: '/assets/others/image1.jpg',
            club: 'Liverpool',
            time: '20mins',
            tags: '#MohamedSalah #Liverpool #Ballon #Ballon',
            date: '20-5-2025',
            type: 'top',
        },
        {
            id: 8,
            title: "Mohamed Salah enters the 2025 Ballon d'Or race",
            imageUrl: '/assets/others/image1.jpg',
            club: 'Liverpool',
            time: '20mins',
            tags: '#MohamedSalah #Liverpool #Ballon #Ballon',
            date: '20-5-2025',
            type: 'top',
        },
    ];
    return (
        <div className="mb-10">
            <div className="mt-5 mb-3 grid grid-cols-12 gap-x-2">
                <h1 className="col-span-9 text-lg font-bold text-black">Trending News</h1>
                <div className="col-span-3 flex justify-end">
                    <div className="flex items-center">
                        <p className="text-xs font-black">View all</p>
                        <ChevronRight className="w-3" />
                    </div>
                </div>
            </div>
            <SlickSlider showArrow={false} autoplay={true} initialSlide={0}>
                {news.map((item) => (
                    <a className="col-span-4 block cursor-pointer rounded-sm px-1 hover:bg-gray-200" key={item.id}>
                        <RecentStoriesTab news={item} layout="ver" />
                    </a>
                ))}
            </SlickSlider>
        </div>
    );
}
