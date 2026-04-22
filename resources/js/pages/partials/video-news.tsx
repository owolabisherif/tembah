import VideoPlayer from '@/components/video-player';
import { cn } from '@/lib/utils';
import useVideoPlayerStore from '@/stores/video-player-store';
import { VideoNewsType, VideoSourceType } from '@/types/news';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import 'video.js/dist/video-js.css';
import VideoNewsCard from './video-news-card';

export default function VideoNews() {
    const [selected, setSelected] = useState(0);
    const [videoSource, setVideoSource] = useState<VideoSourceType[]>([]);
    const { index, player, jump, init, setWaiting, waiting } = useVideoPlayerStore((state) => state);
    const page = usePage();
    const playerRef = useRef<HTMLDivElement>(null);

    const news: VideoNewsType[] = [
        {
            id: 1,
            title: "Mohamed Salah enters the 2025 Ballon d'Or race 1",
            imageUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
            club: 'Liverpool',
            time: '20mins',
            tags: '#MohamedSalah #Liverpool #Ballon',
            date: '20-5-2025',
            type: 'recent',
            videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        },
        {
            id: 2,
            title: "Mohamed Salah enters the 2025 Ballon d'Or race 2",
            imageUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
            club: 'Liverpool',
            time: '20mins',
            tags: '#MohamedSalah #Liverpool #Ballon',
            date: '20-5-2025',
            type: 'top',
            videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        },
        {
            id: 3,
            title: "Mohamed Salah enters the 2025 Ballon d'Or race 3",
            imageUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg',
            club: 'Liverpool',
            time: '20mins',
            tags: '#MohamedSalah #Liverpool #Ballon',
            date: '20-5-2025',
            type: 'recent',
            videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        },
        {
            id: 4,
            title: "Mohamed Salah enters the 2025 Ballon d'Or race 3",
            imageUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg',
            club: 'Liverpool',
            time: '20mins',
            tags: '#MohamedSalah #Liverpool #Ballon',
            date: '20-5-2025',
            type: 'recent',
            videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        },
        {
            id: 5,
            title: "Mohamed Salah enters the 2025 Ballon d'Or race 3",
            imageUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerFun.jpg',
            club: 'Liverpool',
            time: '20mins',
            tags: '#MohamedSalah #Liverpool #Ballon',
            date: '20-5-2025',
            type: 'recent',
            videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        },
    ];

    var total: number = 0;
    var actutalTotal: number = 0;
    var timeout: ReturnType<typeof setTimeout> | undefined | null;

    const handleSetTimeout = () => {
        if (selected === news.length - 1) {
            setSelected(0);
        } else {
            setSelected((n) => n + 1);
        }

        setTimeout(handleSetTimeout, 600);
    };

    useEffect(() => {
        total = actutalTotal = news.length - 1;
        setSelected(0);
        handleSetVideoSource();
    }, []);

    window.addEventListener('close', () => {
        clearTimeout(timeout!);
        timeout = null;
    });

    const handleSelected = (index: number) => {
        if (waiting || !player) return;

        setSelected(index);
        jump(index);

        (player as any).ima.changeAdTag(page.props.adsUrl);
        (player as any).ima.requestAds();
    };

    const handleSetVideoSource = () => {
        var sources: VideoSourceType[] = [];

        for (const item of news) {
            let ars = item.videoUrl.split('.');
            var type = ars[ars.length - 1];
            sources.push({ src: item.videoUrl, type: `video/${type}` });
        }

        setVideoSource(sources);
        init(sources.length);
    };

    const handleUpdatePlaylist = (currentIndex: number) => {};

    return (
        <>
            <div className="flex justify-start">
                <h1 className="mt-5 mb-3 text-lg font-bold text-black">Video News</h1>
            </div>
            <div className="grid grid-cols-12 gap-x-2 overflow-hidden">
                <div className="col-span-8 overflow-hidden rounded-sm">
                    <div className="mb-5 flex w-full flex-row gap-x-2">
                        <div className="flex flex-1 flex-col">
                            <div className="w-full overflow-hidden rounded-sm" ref={playerRef}>
                                <VideoPlayer sources={videoSource} updatePlaylist={handleUpdatePlaylist} />
                            </div>
                            <div>
                                <div className="flex">
                                    <h1 className="flex-1 text-sm font-black overflow-ellipsis whitespace-nowrap">{news[index]?.title}</h1>
                                    <div className="w-20">
                                        <h1 className="text-sm text-gray-500">{news[index]?.date}</h1>
                                    </div>
                                </div>
                                <div className="b w-auto p-2">
                                    <p>{news[index]?.club}</p>
                                    <p className="mt-5 text-xs font-bold">{news[index]?.tags}</p>
                                </div>
                                <div className="mt-5">
                                    <Link href="#" className="rounded-full bg-red-600 px-5 py-2 font-bold text-white hover:bg-[#005FAD]">
                                        Learn More
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-4 overflow-hidden rounded-sm">
                    <div
                        className="grid grid-cols-12 gap-y-1"
                        onMouseEnter={() => {
                            clearTimeout(timeout!);
                            timeout = null;
                        }}
                    >
                        {news.map((item, indx) => (
                            <a
                                className={cn('col-span-12 block cursor-pointer rounded-sm hover:bg-gray-200', index == indx ? 'bg-gray-200' : '')}
                                key={item.id}
                                onClick={() => handleSelected(indx)}
                            >
                                <VideoNewsCard news={item} layout="hor" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
