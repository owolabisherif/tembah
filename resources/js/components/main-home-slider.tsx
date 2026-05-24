import SwiperCarousel from './swiper-carousel';
// import useSliderStore from '@/stores/slider-store';
import { Link } from '@inertiajs/react';
import { ClockIcon } from 'lucide-react';
// import { useTranslation } from 'react-i18next';
import i18next, { t } from 'i18next';
import { SwiperSlide } from 'swiper/react';

const breakpoints = {
    320: {
        slidesPerView: 1,
        spaceBetween: 10,
    },
    480: {
        slidesPerView: 1,
        spaceBetween: 20,
    },
    640: {
        slidesPerView: 1,
        spaceBetween: 40,
    },
    720: {
        slidesPerView: 4,
        spaceBetween: 50,
    },
};

export type Slider = {
    id: number;
    slug: string;
    slug_ar: string;
    title: string;
    title_ar: string;
    body: string;
    body_ar: string;
    image: {
        name: string;
    } | null;
    name?: string; //imageurl
    created_at: string;
    type: 'text' | 'transfer' | 'video';
    page?: string;
};

type MainHomeSliderProp = {
    sliders: Slider[];
};

export default function MainHomeSlider({ sliders }: MainHomeSliderProp) {
    return (
        <>
            {Boolean(sliders.length) ? (
                <SwiperCarousel spaceBetween={30} slidesPerView={1} loop={sliders.length > 1}>
                    {sliders.map((slider) =>
                        slider.type == 'text' || slider.type == 'transfer' ? (
                            <SwiperSlide
                                style={{ backgroundImage: `url(${slider.name ?? slider.image?.name})` }}
                                className="h-full bg-cover bg-center"
                                dir="ltr"
                                key={slider.id}
                            >
                                <div
                                    className="flex h-full w-full flex-col items-start justify-end bg-[#00315F]/45 px-20 pb-5 text-white"
                                    dir={i18next.dir()}
                                >
                                    <div className="mb-5 flex items-center justify-center gap-5">
                                        <Link
                                            href={route('show.news', { slug: slider.slug, type: slider.page ?? 'slider' })}
                                            className="rounded-full bg-red-600 px-5 py-2 font-bold text-white hover:bg-[#005FAD]"
                                        >
                                            {t('Learn more')}
                                        </Link>
                                        <div className="flex items-center justify-center gap-1">
                                            <ClockIcon className="w-4" />
                                            <p className="text-xs">{slider.created_at}</p>
                                        </div>
                                    </div>
                                    <h1 className="mt-10 mb-5 hidden text-xl font-bold md:mt-0 md:block md:text-2xl">
                                        {i18next.language == 'en' ? slider.title : slider.title_ar}
                                    </h1>
                                </div>
                            </SwiperSlide>
                        ) : (
                            <SwiperSlide
                                style={{ backgroundImage: `url(${slider.name ?? slider.image?.name})` }}
                                className="h-full bg-cover bg-center"
                                dir="ltr"
                                key={slider.id}
                            >
                                <div
                                    className="flex h-full w-full flex-col items-start justify-end bg-[#00315F]/45 px-20 pb-5 text-white"
                                    dir={i18next.dir()}
                                >
                                    <div className="flex w-full items-center justify-center">
                                        <div className="size-10 md:size-24">
                                            <img src="/assets/icons/playbtn.png" alt="" className="h-full w-full object-contain" />
                                        </div>
                                    </div>
                                    <div className="mb-5 flex items-center justify-center gap-5">
                                        <Link
                                            href={route('show.news', { slug: slider.slug, type: slider.page ?? 'slider' })}
                                            className="rounded-full bg-red-600 px-5 py-2 font-bold text-white hover:bg-[#005FAD]"
                                        >
                                            {t('Learn more')}
                                        </Link>
                                        <div className="flex items-center justify-center gap-1">
                                            <ClockIcon className="w-4" />
                                            <p className="text-xs">{slider.created_at}</p>
                                        </div>
                                    </div>
                                    <h1 className="mt-10 mb-5 hidden text-xl font-bold md:mt-0 md:block md:text-2xl">
                                        {i18next.language == 'en' ? slider.title : slider.title_ar}
                                    </h1>
                                </div>
                            </SwiperSlide>
                        ),
                    )}
                </SwiperCarousel>
            ) : (
                <div className="h-48 w-full animate-pulse rounded-sm bg-gray-200 md:h-100"></div>
            )}
        </>
    );
}
