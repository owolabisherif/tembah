import { News } from '@/types/news';
import TopLeagues from './top-leagues';
import VideoNewsCard from './video-news-card';

export default function VideoNewsBck() {
    const news: News[] = [
        {
            id: 1,
            title: "Mohamed Salah enters the 2025 Ballon d'Or race",
            imageUrl: '/assets/others/image1.jpg',
            club: 'Liverpool',
            time: '20mins',
            tags: '#MohamedSalah #Liverpool #Ballon',
            type: 'recent',
            date: '12-5-2025',
        },
        {
            id: 2,
            title: "Mohamed Salah enters the 2025 Ballon d'Or race",
            imageUrl: '/assets/others/image1.jpg',
            club: 'Liverpool',
            time: '20mins',
            tags: '#MohamedSalah #Liverpool #Ballon',
            type: 'top',
            date: '12-5-2025',
        },
        {
            id: 3,
            title: "Mohamed Salah enters the 2025 Ballon d'Or race",
            imageUrl: '/assets/others/image1.jpg',
            club: 'Liverpool',
            time: '20mins',
            tags: '#MohamedSalah #Liverpool #Ballon',
            type: 'recent',
            date: '12-5-2025',
        },
        {
            id: 4,
            title: "Mohamed Salah enters the 2025 Ballon d'Or race",
            imageUrl: '/assets/others/image1.jpg',
            club: 'Liverpool',
            time: '20mins',
            tags: '#MohamedSalah #Liverpool #Ballon',
            type: 'recent',
            date: '12-5-2025',
        },
        {
            id: 5,
            title: "Mohamed Salah enters the 2025 Ballon d'Or race",
            imageUrl: '/assets/others/image1.jpg',
            club: 'Liverpool',
            time: '20mins',
            tags: '#MohamedSalah #Liverpool #Ballon #Ballon',
            type: 'top',
            date: '12-5-2025',
        },
        {
            id: 6,
            title: "Mohamed Salah enters the 2025 Ballon d'Or race",
            imageUrl: '/assets/others/image1.jpg',
            club: 'Liverpool',
            time: '20mins',
            tags: '#MohamedSalah #Liverpool #Ballon #Ballon',
            type: 'top',
            date: '12-5-2025',
        },
        {
            id: 7,
            title: "Mohamed Salah enters the 2025 Ballon d'Or race",
            imageUrl: '/assets/others/image1.jpg',
            club: 'Liverpool',
            time: '20mins',
            tags: '#MohamedSalah #Liverpool #Ballon #Ballon',
            type: 'top',
            date: '12-5-2025',
        },
        {
            id: 8,
            title: "Mohamed Salah enters the 2025 Ballon d'Or race",
            imageUrl: '/assets/others/image1.jpg',
            club: 'Liverpool',
            time: '20mins',
            tags: '#MohamedSalah #Liverpool #Ballon #Ballon',
            type: 'top',
            date: '12-5-2025',
        },
    ];

    return (
        <>
            <div className="flex justify-start">
                <h1 className="mt-5 mb-3 text-lg font-bold text-black">Video News</h1>
            </div>
            <div className="flex w-full flex-row gap-x-2">
                <div className="flex h-full flex-1 overflow-hidden rounded-sm">
                    <div className="grid grid-cols-12 gap-5">
                        {news.map((item) => (
                            <a className="col-span-4 block cursor-pointer rounded-sm hover:bg-gray-200" key={item.id}>
                                <VideoNewsCard news={item} layout="ver" />
                            </a>
                        ))}
                    </div>
                </div>
                <div className="h-full w-80 p-0">
                    <TopLeagues />
                </div>
            </div>
        </>
    );
}
