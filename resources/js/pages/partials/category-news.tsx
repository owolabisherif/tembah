import CategoryNewsCard from '@/components/category-news-card';
import { cn } from '@/lib/utils';
import { CategoryNewsList } from '@/types/news';
import AllLeagues from './all-leagues';

export interface CategoryNewsType {
    id: number;
    title: string;
    url: string;
    news: CategoryNewsList[];
}

export default function CategoryNews() {
    const categories: CategoryNewsType[] = [
        {
            id: 1,
            title: 'English league',
            url: '#',
            news: [
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
            ],
        },
        {
            id: 2,
            title: 'Spanish league',
            url: '#',
            news: [
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
            ],
        },
        {
            id: 3,
            title: 'Important Tournaments',
            url: '#',
            news: [
                {
                    id: 1,
                    title: "Mohamed Salah enters the 2025 Ballon d'Or race",
                    imageUrl: '/assets/others/image1.jpg',
                },
                {
                    id: 2,
                    title: "Mohamed Salah enters the 2025 Ballon d'Or race",
                    imageUrl: '/assets/others/image1.jpg',
                },
                {
                    id: 3,
                    title: "Mohamed Salah enters the 2025 Ballon d'Or race",
                    imageUrl: '/assets/others/image1.jpg',
                },
                {
                    id: 4,
                    title: "Mohamed Salah enters the 2025 Ballon d'Or race",
                    imageUrl: '/assets/others/image1.jpg',
                },
            ],
        },
        {
            id: 4,
            title: 'Important Tournaments 2',
            url: '#',
            news: [
                {
                    id: 1,
                    title: "Mohamed Salah enters the 2025 Ballon d'Or race",
                    imageUrl: '/assets/others/image1.jpg',
                },
                {
                    id: 2,
                    title: "Mohamed Salah enters the 2025 Ballon d'Or race",
                    imageUrl: '/assets/others/image1.jpg',
                },
                {
                    id: 3,
                    title: "Mohamed Salah enters the 2025 Ballon d'Or race",
                    imageUrl: '/assets/others/image1.jpg',
                },
                {
                    id: 4,
                    title: "Mohamed Salah enters the 2025 Ballon d'Or race",
                    imageUrl: '/assets/others/image1.jpg',
                },
            ],
        },
    ];

    return (
        <>
            <div className="grid grid-cols-12 grid-rows-1 gap-x-2">
                <div className="col-span-9 w-full">
                    {categories.map((item, index) => (
                        <div className={cn(index != 0 && 'mt-10')} key={item.id}>
                            <CategoryNewsCard {...item} />
                        </div>
                    ))}
                </div>

                <div className="col-span-3 overflow-y-hidden p-0">
                    <AllLeagues />
                </div>
            </div>
        </>
    );
}
