import { PropsWithChildren, useEffect, useRef } from 'react';
import Slider from 'react-slick';

function NextArrow(props: any) {
    const { className, style, onClick, showArrow } = props;

    if (!showArrow) return <div></div>;
    return <div className={className} style={{ ...style, display: 'block', zIndex: 40 }} onClick={onClick} />;
}

function PrevArrow(props: any) {
    const { className, style, onClick, showArrow } = props;

    if (!showArrow) return <div></div>;

    return <div className={className} style={{ ...style, display: 'block', zIndex: 40 }} onClick={onClick} />;
}

type SlickSliderType = {
    showArrow: boolean;
    infinite?: boolean;
    autoplay: boolean;
    initialSlide: number;
    slidesToShow?: number;
};

export default function SlickSlider(props: PropsWithChildren<SlickSliderType>) {
    const sliderRef = useRef(null);

    useEffect(() => {
        if (sliderRef && props.initialSlide > 0) (sliderRef.current as any)?.slickGoTo(props.initialSlide);
    }, [props.initialSlide]);

    var settings = {
        dots: false,
        infinite: props.infinite ?? true,
        slidesToShow: props.slidesToShow ?? 4,
        slidesToScroll: 1,
        autoplay: props.autoplay,
        initialSlide: 0,
        speed: 500,
        autoplaySpeed: 3000,
        // cssEase: props.cssEase ?? null,
        // adaptiveHeight: props.adaptiveHeight ?? true,
        pauseOnHover: true,
        centerMode: false,
        rtl: false,
        nextArrow: <NextArrow showArrow={props.showArrow} />,
        prevArrow: <PrevArrow showArrow={props.showArrow} />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: props.slidesToShow ?? 3,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: props.slidesToShow ?? 2,
                    slidesToScroll: 2,
                    initialSlide: 2,
                    centerMode: false,
                    dots: false,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    centerMode: false,
                    dots: false,
                    autoplay: true,
                },
            },
        ],
    };

    return (
        <Slider {...settings} ref={sliderRef}>
            {props.children}
        </Slider>
    );
}
