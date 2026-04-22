import { cn } from '@/lib/utils';
import { News } from '@/types/news';
import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import RecentStoriesTab from './recent-stories-tab';

export default function FeaturedNews() {
    const [selected, setSelected] = useState(0);

    const news: News[] = [
        {
            id: 1,
            title: "Mohamed Salah enters the 2025 Ballon d'Or race 1",
            imageUrl: '/assets/others/image1.jpg',
            club: 'Liverpool',
            time: '20mins',
            tags: '#MohamedSalah #Liverpool #Ballon',
            date: '20-5-2025',
            type: 'recent',
        },
        {
            id: 2,
            title: "Mohamed Salah enters the 2025 Ballon d'Or race 2",
            imageUrl: '/assets/others/image2.jpg',
            club: 'Liverpool',
            time: '20mins',
            tags: '#MohamedSalah #Liverpool #Ballon',
            date: '20-5-2025',
            type: 'top',
        },
        {
            id: 3,
            title: "Mohamed Salah enters the 2025 Ballon d'Or race 3",
            imageUrl: '/assets/others/image3.jpg',
            club: 'Liverpool',
            time: '20mins',
            tags: '#MohamedSalah #Liverpool #Ballon',
            date: '20-5-2025',
            type: 'recent',
        },
    ];

    var total: number = 0;
    var actutalTotal: number = 0;
    var timeout: ReturnType<typeof setTimeout> | undefined | null;

    const handleSetTimeout = () => {
        // timeout = setTimeout(() => {

        // }, 600);

        // if (total < actutalTotal) {
        //     total++;
        // } else {
        //     total--;
        // }

        if (selected === news.length - 1) {
            setSelected(0);
        } else {
            setSelected((n) => n + 1);
        }
        // setSelected(total);
        console.log(total);
        console.log(selected);

        setTimeout(handleSetTimeout, 600);
    };

    useEffect(() => {
        total = actutalTotal = news.length - 1;
        setSelected(0);
        // handleSetTimeout();
    }, []);

    window.addEventListener('close', () => {
        clearTimeout(timeout!);
        timeout = null;
    });

    const handleSelected = (index: number) => {
        // clearTimeout(timeout!);
        // timeout = null;
        setSelected(index);
    };

    return (
        <>
            <div className="flex justify-start">
                <h1 className="mt-5 mb-3 text-lg font-bold text-black">Featured News</h1>
            </div>
            <div className="mb-5 flex w-full flex-row gap-x-2">
                <div className="flex flex-1 flex-col">
                    <div
                        style={{ '--image-url': `url(${news[selected]?.imageUrl})` } as any}
                        className={cn(
                            'mb-3 flex-1 animate-fadein rounded-sm bg-gray-500 bg-[image:var(--image-url)] bg-cover bg-center transition-all',
                        )}
                    ></div>
                    <h1 className="text-sm font-black">{news[selected]?.title}</h1>
                    <h1 className="text-sm text-gray-500">{news[selected]?.date}</h1>
                    <div className="w-auto p-2">
                        <p>{news[selected]?.club}</p>
                        <p className="mt-5 text-xs font-bold">{news[selected]?.tags}</p>
                    </div>
                    <div className="mt-5">
                        <Link href="#" className="rounded-full bg-red-600 px-5 py-2 font-bold text-white hover:bg-[#005FAD]">
                            Learn More
                        </Link>
                    </div>
                </div>
                <div className="flex h-full w-80 overflow-hidden rounded-sm">
                    <div
                        className="grid grid-cols-12 gap-5"
                        onMouseEnter={() => {
                            clearTimeout(timeout!);
                            timeout = null;
                        }}
                    >
                        {news.map((item, index) => (
                            <button
                                className={cn(
                                    'col-span-12 block cursor-pointer rounded-sm pr-2 transition-all hover:bg-gray-200',
                                    index == selected && 'bg-gray-200',
                                )}
                                onClick={() => handleSelected(index)}
                                key={item.id}
                            >
                                <RecentStoriesTab news={item} layout="hor" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
