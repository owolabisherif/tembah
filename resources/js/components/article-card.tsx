import Article from '@/types/article';

export default function ArtcleCard(article: Article) {
    return (
        <div className="flex w-full flex-col gap-x-3 shadow-sm">
            <div className="mb-1 h-32 w-full overflow-hidden rounded-sm">
                <img src={article.imageUrl} alt={article.title} className="h-full w-full object-cover object-center" />
            </div>
            <div className="flex h-24 flex-1 flex-col overflow-hidden px-2">
                <div className="mb-2 flex justify-between text-xs">
                    <h3 className="font-black">{article.title}</h3>
                </div>
                <p className="mb-2 text-xs">{article.body}</p>
                <div className="mb-3 flex w-full items-center justify-start">
                    <div className="mr-2 h-9 w-9 overflow-hidden rounded-full border-2 border-red-200">
                        <img src={article.author.imageUrl} alt={article.author.name} className="h-full w-full object-cover object-center" />
                    </div>
                    <div className="flex flex-col">
                        <p className="pr-3 text-xs font-bold">{article.author.name}</p>
                        <p className="pr-3 text-xs text-gray-500">{article.time}</p>
                    </div>
                </div>
                <p className="text-xs font-bold">{article.tags}</p>
            </div>
        </div>
    );
}
