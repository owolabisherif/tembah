import SwiperCarousel from './swiper-carousel';
// import useSliderStore from '@/stores/slider-store';
import { Link } from '@inertiajs/react';
import { ClockIcon } from 'lucide-react';
// import { useTranslation } from 'react-i18next';
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

type Slider = {
    id: number;
    title: string;
    body: string;
    route: string;
    imageUrl: string;
    videoUrl?: string;
    time: string;
    type: 'image' | 'video';
};

export default function MainHomeSlider() {
    // const { t, i18n } = useTranslation();
    // const [sliders, setSliders] = useState<SliderItem[]>([]);
    // let { sliders, loading, addSliders } = useSliderStore((store) => store);

    // useEffect(() => {
    //     getSliders();
    // }, []);

    // const getSliders = async () => {
    //     if (!sliders.length) addSliders([]);
    // };

    var sliders: Slider[] = [
        {
            id: 1,
            title: "Mohamed Salah enters the 2025 Ballon d'Or race",
            imageUrl: '/assets/others/image1.jpg',
            body: "Mohamed Salah enters the 2025 Ballon d'Or race",
            route: '/',
            time: '30 mins',
            type: 'image',
        },
        {
            id: 2,
            title: "Mohamed Salah enters the 2025 Ballon d'Or race Mohamed Salah enters the 2025 Ballon d'Or race",
            imageUrl: '/assets/others/image1.jpg',
            body: "Mohamed Salah enters the 2025 Ballon d'Or race",
            route: '/',
            time: '20 mins',
            type: 'image',
        },
        {
            id: 3,
            title: "Mohamed Salah enters the 2025 Ballon d'Or race Mohamed Salah enters the 2025 Ballon d'Or race",
            imageUrl: '/assets/others/image1.jpg',
            body: "Mohamed Salah enters the 2025 Ballon d'Or race",
            route: '/',
            time: '20 mins',
            type: 'video',
            videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        },
    ];

    return (
        <>
            {sliders.length && (
                <SwiperCarousel spaceBetween={30} slidesPerView={1} loop={true} className="">
                    {sliders.map((slider) =>
                        slider.type == 'image' ? (
                            <SwiperSlide
                                style={{ backgroundImage: `url(${slider.imageUrl})` }}
                                className="h-full bg-cover bg-center"
                                dir="ltr"
                                key={slider.id}
                            >
                                <div className="flex h-full w-full flex-col items-start justify-end bg-[#00315F]/45 px-20 pb-5 text-white">
                                    {slider.route && (
                                        <div className="mb-5 flex items-center justify-center gap-5">
                                            <Link
                                                href={slider.route}
                                                className="rounded-full bg-red-600 px-5 py-2 font-bold text-white hover:bg-[#005FAD]"
                                            >
                                                Learn more
                                            </Link>
                                            <div className="flex items-center justify-center gap-1">
                                                <ClockIcon className="w-4" />
                                                <p className="text-xs">{slider.time}</p>
                                            </div>
                                        </div>
                                    )}
                                    <h1 className="mt-10 mb-5 text-xl font-bold md:mt-0 md:text-2xl">{slider.title}</h1>
                                </div>
                            </SwiperSlide>
                        ) : (
                            <SwiperSlide
                                style={{ backgroundImage: `url(${slider.imageUrl})` }}
                                className="h-full bg-cover bg-center"
                                dir="ltr"
                                key={slider.id}
                            >
                                <div className="flex h-full w-full flex-col items-start justify-end bg-[#00315F]/45 px-20 pb-5 text-white">
                                    <div className="flex w-full items-center justify-center">
                                        <div className="h-24 w-24">
                                            <img src="/assets/icons/playbtn.png" alt="" className="h-full w-full object-contain" />
                                        </div>
                                    </div>
                                    {slider.route && (
                                        <div className="mb-5 flex items-center justify-center gap-5">
                                            <Link
                                                href={slider.route}
                                                className="rounded-full bg-red-600 px-5 py-2 font-bold text-white hover:bg-[#005FAD]"
                                            >
                                                Learn more
                                            </Link>
                                            <div className="flex items-center justify-center gap-1">
                                                <ClockIcon className="w-4" />
                                                <p className="text-xs">{slider.time}</p>
                                            </div>
                                        </div>
                                    )}
                                    <h1 className="mt-10 mb-5 text-xl font-bold md:mt-0 md:text-2xl">{slider.title}</h1>
                                </div>
                            </SwiperSlide>
                        ),
                    )}
                </SwiperCarousel>
            )}
        </>
    );
}
