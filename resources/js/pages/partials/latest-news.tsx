import { News } from '@/types/news';
import { ChevronRight } from 'lucide-react';
import LiveMatch from './live-match';
import RecentStoriesTab from './recent-stories-tab';
import TransferNews from './transfer-news';
import TrendingNews from './trending-news';

export default function LatestNews() {
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
        <>
            <div className="mt-5 mb-3 grid grid-cols-12 gap-x-2">
                <div className="col-span-9">
                    <div className="flex items-baseline justify-between">
                        <h1 className="text-lg font-bold text-black">News</h1>
                        <div className="flex items-center">
                            <p className="text-xs font-black">View all</p>
                            <ChevronRight className="w-3" />
                        </div>
                    </div>
                </div>
                <div className="col-span-3"></div>
            </div>

            <div className="grid grid-cols-12 gap-x-2">
                <div className="col-span-9 h-full flex-1 overflow-hidden rounded-sm">
                    <div className="grid grid-cols-12 gap-5">
                        {news.map((item) => (
                            <a className="col-span-4 block cursor-pointer rounded-sm hover:bg-gray-200" key={item.id}>
                                <RecentStoriesTab news={item} layout="ver" />
                            </a>
                        ))}
                        <div className="col-span-12">
                            <TransferNews />
                        </div>
                        <div className="col-span-12">
                            <TrendingNews />
                        </div>
                    </div>
                </div>

                <div className="col-span-3 overflow-hidden">
                    <LiveMatch />
                </div>
            </div>
        </>
    );
}
