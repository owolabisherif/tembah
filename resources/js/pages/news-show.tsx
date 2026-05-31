import Loader from '@/components/loader';
import SwiperCarousel from '@/components/swiper-carousel';
import ShareButtons from '@/components/ui/share_buttons';
import VideoPlayerWrapper from '@/components/ui/video-player-wrapper';
import { usePlaceholderImage } from '@/hooks/user-placeholder-image';
import GuestLayout from '@/layouts/guest-layout';
import { BreadcrumbItem } from '@/types';
import { News } from '@/types/news';
import { Deferred, Link } from '@inertiajs/react';
import axios from 'axios';
import i18next, { t } from 'i18next';
import { useEffect } from 'react';
import { SwiperSlide } from 'swiper/react';
import Ad from './partials/ad';

type NewsShowProp = {
    news: News;
    type: {
        url: string;
        text: string;
        page: string | null;
    };
    slug: string;
};

export default function NewsShow({ slug, type, news }: NewsShowProp) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('Home'),
            href: route('home'),
        },
        {
            title: t(type.text),
            href: type.url,
        },
        {
            title: i18next.language == 'en' ? news?.title : news?.title_ar,
            href: '#',
        },
    ];

    useEffect(() => {
        if (!news) return;

        if (type.text == 'articles') {
            axios.post(route('article.views.store'), { id: news.id });
            return;
        }

        axios.post(route('news.views.store'), { id: news.id });
    }, [news]);

    const handleUpdatePlaylist = (currentIndex: number) => {};

    return (
        <GuestLayout title={i18next.language == 'en' ? news?.title : news?.title_ar} breadcrumbs={breadcrumbs}>
            <Deferred fallback={<Loader />} data="news">
                {news && (
                    <div className="w-full">
                        <div className="h-fit w-full overflow-hidden rounded-sm">
                            {news.type == 'video' ? (
                                <div>
                                    {/* <video className="h-full w-full" controls autoPlay>
                                        <source src={news.video_url!} />
                                    </video> */}
                                    <VideoPlayerWrapper sources={[{ type: '', src: news.video_url! }]} />
                                </div>
                            ) : (
                                <div className="h-fit w-full md:h-[40rem]">
                                    {news.images.length > 1 ? (
                                        <SwiperCarousel spaceBetween={30} slidesPerView={1} loop={true} className="">
                                            {news.images.map((image) => (
                                                <SwiperSlide
                                                    style={{ backgroundImage: `url(${image.name})` }}
                                                    className="h-full bg-cover bg-center"
                                                    dir="ltr"
                                                    key={image.name}
                                                ></SwiperSlide>
                                            ))}
                                        </SwiperCarousel>
                                    ) : (
                                        <img
                                            src={news.images[0].name}
                                            alt={i18next.language == 'en' ? news.title : news.title_ar}
                                            className="h-56 w-full bg-contain bg-center md:h-full"
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="mb-10">
                            <h1 className="my-5 text-2xl font-bold text-black dark:text-white">
                                {i18next.language == 'en' ? news.title : news.title_ar}
                            </h1>
                            <div className="flex flex-col gap-y-5">
                                <div className="flex h-fit w-full flex-1 items-center gap-x-1">
                                    <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-100">
                                        <img
                                            src={news?.author?.image ? news?.author?.image?.name : usePlaceholderImage()}
                                            alt={news.title}
                                            className="h-full w-full object-cover object-center"
                                        />
                                    </div>
                                    <p className="text-xs">
                                        {news?.author?.name ?? 'Tembah'} • {news.created_at}
                                    </p>
                                </div>
                                <div className="flex w-full justify-end">
                                    <div>
                                        <ShareButtons news={news} url={window.location.href} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <article
                            className="prose mb-5 w-full max-w-none text-black dark:!text-white"
                            dangerouslySetInnerHTML={{ __html: i18next.language == 'en' ? news.body! : news.body_ar! }}
                        ></article>

                        <Ad />

                        <div className="mt-5 flex flex-wrap gap-px">
                            {news.tags &&
                                news.tags.map((item) => (
                                    <Link
                                        href={route('tag.news', { slug: item.slug })}
                                        key={item.slug}
                                        className="w-fit rounded-full bg-gray-500 px-2 py-1.5 text-white hover:bg-gray-300 hover:text-black"
                                    >
                                        {`#${i18next.language == 'en' ? item.title : item.title_ar}`}
                                    </Link>
                                ))}
                        </div>
                    </div>
                )}
            </Deferred>
        </GuestLayout>
    );
}
