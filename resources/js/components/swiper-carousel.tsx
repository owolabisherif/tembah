import { ReactElement, useRef } from 'react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { Swiper } from 'swiper/react';
import { SwiperOptions } from 'swiper/types';

type Breakpoint = {
    [width: number]: SwiperOptions;
    [ratio: string]: SwiperOptions;
};

type SwiperProp = {
    spaceBetween?: number;
    slidesPerView?: number;
    loop?: boolean;
    showProgress?: boolean;
    breakpoints?: Breakpoint;
    classData?: string;
    delay?: number;
};

export default function SwiperCarousel(props: any) {
    let progressUI: ReactElement | null = null;
    const progressCircle = useRef<SVGSVGElement>(null);
    const progressContent = useRef<HTMLElement>(null);
    const onAutoplayTimeLeft = (s: any, time: any, progress: number) => {
        if (props.showProgress) {
            progressCircle.current!.style.setProperty('--progress', (1 - progress).toString());
            progressContent.current!.textContent = `${Math.ceil(time / 1000)}s`;
        }
    };

    if (props.showProgress) {
        progressUI = (
            <div className="autoplay-progress" slot="container-end">
                <svg viewBox="0 0 48 48" ref={progressCircle}>
                    <circle cx="24" cy="24" r="20"></circle>
                </svg>
                <span ref={progressContent}></span>
            </div>
        );
    }

    return (
        <>
            <Swiper
                dir="rtl"
                spaceBetween={props.spaceBetween}
                slidesPerView={props.slidesPerView}
                slidesPerGroup={1}
                centeredSlides={false}
                breakpoints={props.breakpoints}
                loop={props.loop}
                observer={true}
                observeParents={true}
                autoplay={{
                    delay: props.delay ?? 2500,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                onAutoplayTimeLeft={onAutoplayTimeLeft}
                pagination={{
                    clickable: true,
                }}
                navigation={false}
                modules={[Autoplay, Pagination, Navigation, EffectFade]}
                className={props.classData}
            >
                {props.children}

                {progressUI}
            </Swiper>
        </>
    );
}
