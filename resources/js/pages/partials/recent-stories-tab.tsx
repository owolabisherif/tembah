import { News } from '@/types/news';

type StoriesTabProp = {
    news: News;
    layout?: 'hor' | 'ver';
};

export default function StoriesTab({ news, layout = 'hor' }: StoriesTabProp) {
    return (
        <>
            {layout == 'hor' ? (
                <div className="flex gap-x-3 gap-y-4">
                    <div className="h-24 w-24 overflow-hidden rounded-sm">
                        <img src={news.imageUrl} alt={news.title} className="h-full w-full object-cover object-center" />
                    </div>
                    <div className="flex h-24 flex-1 flex-col overflow-hidden">
                        <div className="mb-2 flex justify-between text-xs">
                            <h3 className="text-gray-400">
                                {news.club} • {news.time}
                            </h3>
                            <h3 className="text-gray-400">{news.date}</h3>
                        </div>
                        <div className="flex h-full flex-col items-start justify-between">
                            <p className="text-start text-xs font-black">{news.title}</p>
                            <p className="text-xs">{news.tags}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex w-full flex-col gap-x-3">
                    <div className="mb-1 h-32 w-full overflow-hidden rounded-sm">
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
                            <p className="mb-5 items-start text-xs font-black">{news.title}</p>
                            <p className="text-xs">{news.tags}</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
