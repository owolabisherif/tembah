import { News } from '@/types/news';

type StoriesTabProp = {
    news: News;
    layout?: 'hor' | 'ver';
};

export default function VideoNewsCard({ news, layout = 'hor' }: StoriesTabProp) {
    return (
        <>
            {layout == 'hor' ? (
                <div className="relative flex gap-x-3 gap-y-4">
                    <div className="relative h-24 w-24 overflow-hidden rounded-sm">
                        <div className="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center bg-gray-500/45">
                            <div className="w-8">
                                <img src="/assets/icons/playbtn.png" alt="" className="w-full" />
                            </div>
                        </div>
                        <img src={news.imageUrl} alt={news.title} className="h-full w-full object-cover object-center" />
                    </div>
                    <div className="flex h-24 flex-1 flex-col overflow-hidden">
                        <h3 className="mb-1 text-xs text-gray-400">
                            {news.club} • {news.time}
                        </h3>
                        <div className="flex h-full flex-col justify-between">
                            <p className="text-xs font-black">{news.title}</p>
                            <p className="text-xs">{news.tags}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex w-full flex-col gap-x-3">
                    <div className="relative mb-1 h-32 w-full overflow-hidden rounded-sm">
                        <div className="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center bg-gray-500/45">
                            <div className="w-8">
                                <img src="/assets/icons/playbtn.png" alt="" className="w-full" />
                            </div>
                        </div>
                        <img src={news.imageUrl} alt={news.title} className="h-full w-full object-cover object-center" />
                    </div>
                    <div className="flex h-24 flex-1 flex-col overflow-hidden px-2">
                        <div className="mb-2 flex justify-between text-xs">
                            <h3 className="text-gray-400">
                                {news.club} • {news.time}
                            </h3>
                            <h3 className="text-gray-400">{news.date}</h3>
                        </div>
                        <div className="flex h-full flex-col justify-between">
                            <p className="mb-5 text-xs font-black">{news.title}</p>
                            <p className="text-xs">{news.tags}</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
