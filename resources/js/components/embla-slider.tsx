import useDataPagination from '@/hooks/use-data-pagination';
import useDateInterpretation from '@/hooks/use-date-interpretation';
import { cn } from '@/lib/utils';
import useLeagueStore from '@/stores/use-league-store';
import { EmblaCarouselType, EmblaEventType } from 'embla-carousel';
import AutoHeight from 'embla-carousel-auto-height';
import useEmblaCarousel from 'embla-carousel-react';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import i18next from 'i18next';
import { Calendar1Icon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

export default function EmblaSlider({
    slide,
    style,
    scrollTo,
    league,
    ...props
}: {
    slide: React.ReactNode;
    style?: string;
    league?: number;
    scrollTo?: number;
}) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false }, [AutoHeight(), WheelGesturesPlugin()]);
    const [title, setTitle] = useState<string>('');
    const [scrollPrevDisabled, setScrollPrevDisabled] = useState<boolean>(true);
    const [scrollNextDisabled, setScrollNextDisabled] = useState<boolean>(true);
    const { leagues } = useLeagueStore();

    const emblaScroll = useCallback((emblaApi: EmblaCarouselType, e: EmblaEventType) => {
        const slides = emblaApi.slideNodes();
        const scrollIndex = emblaApi.selectedScrollSnap();

        if (league) {
            let fixtures = leagues[league]?.fixtures?.matches;
            let pages = fixtures ? useDataPagination(fixtures, 3) : [];

            const startDate = useDateInterpretation(pages[scrollIndex][0][0].date);
            const endDate = useDateInterpretation(pages[scrollIndex][pages[scrollIndex].length - 1][0].date);

            setTitle(`${startDate} - ${endDate}`);
        }
    }, []);

    useEffect(() => {
        if (emblaApi) emblaApi.on('slidesInView', emblaScroll);
    }, [emblaApi, emblaScroll]);

    useEffect(() => {
        if (emblaApi && scrollTo) {
            emblaApi.scrollTo(scrollTo, true);
        }
    }, [scrollTo, emblaApi]);

    useEffect(() => {
        if (emblaApi?.canScrollPrev()) {
            setScrollPrevDisabled(false);
        } else {
            setScrollPrevDisabled(true);
        }
        if (emblaApi?.canScrollNext()) {
            setScrollNextDisabled(false);
        } else {
            setScrollNextDisabled(true);
        }
    }, [title, emblaApi]);

    const handleSlide = (dir: 'left' | 'right') => {
        if (dir == 'left' && emblaApi?.canScrollPrev()) emblaApi?.scrollPrev();

        if (dir == 'right' && emblaApi?.canScrollNext()) emblaApi?.scrollNext();
    };

    return (
        <div className={cn('pt-10', style ?? '')}>
            {title != '' ? (
                <div className="flex w-full justify-between px-10">
                    <button
                        onClick={() => handleSlide(i18next.language == 'en' ? 'left' : 'right')}
                        disabled={scrollPrevDisabled}
                        className={cn(
                            'flex size-10 cursor-pointer items-center justify-center rounded-full border-2 hover:bg-gray-300',
                            scrollPrevDisabled ? 'border-blue-950/20' : 'border-blue-950',
                        )}
                    >
                        {i18next.language == 'en' ? (
                            <ChevronLeft className={cn('size-7', scrollPrevDisabled ? 'text-blue-950/20' : 'text-blue-950')} />
                        ) : (
                            <ChevronRight className={cn('size-7', scrollPrevDisabled ? 'text-blue-950/20' : 'text-blue-950')} />
                        )}
                    </button>

                    <div
                        className="flex w-fit items-center justify-center gap-x-2 rounded-sm bg-gray-500 px-2 py-1 text-sm font-bold text-white"
                        dir={i18next.dir()}
                    >
                        <Calendar1Icon className="size-4" />
                        <h3 dir={i18next.dir()}>{title}</h3>
                    </div>

                    <button
                        onClick={() => handleSlide(i18next.language == 'en' ? 'right' : 'left')}
                        className={cn(
                            'flex size-10 cursor-pointer items-center justify-center rounded-full border-2 hover:bg-gray-300',
                            scrollNextDisabled ? 'border-blue-950/20' : 'border-blue-950',
                        )}
                        disabled={scrollNextDisabled}
                    >
                        {i18next.language == 'en' ? (
                            <ChevronRight className={cn('size-7 text-blue-950', scrollNextDisabled ? 'text-blue-950/20' : 'text-blue-950')} />
                        ) : (
                            <ChevronLeft className={cn('size-7 text-blue-950', scrollNextDisabled ? 'text-blue-950/20' : 'text-blue-950')} />
                        )}
                    </button>
                </div>
            ) : (
                <div className="flex w-full justify-between px-10">
                    <button
                        onClick={() => handleSlide(i18next.language == 'en' ? 'left' : 'right')}
                        className="flex size-10 cursor-pointer items-center justify-center rounded-full border-2 border-blue-950 hover:bg-gray-300"
                    >
                        {i18next.language == 'en' ? (
                            <ChevronLeft className="size-7 text-blue-950" />
                        ) : (
                            <ChevronRight className="size-7 text-blue-950" />
                        )}
                    </button>
                    <h3></h3>
                    <button
                        onClick={() => handleSlide(i18next.language == 'en' ? 'right' : 'left')}
                        className="flex size-10 cursor-pointer items-center justify-center rounded-full border-2 border-blue-950 hover:bg-gray-300"
                    >
                        {i18next.language == 'en' ? (
                            <ChevronRight className="size-7 text-blue-950" />
                        ) : (
                            <ChevronLeft className="size-7 text-blue-950" />
                        )}
                    </button>
                </div>
            )}
            <div className="embla pt-10" ref={emblaRef} dir="ltr">
                <div className="embla__container">{slide}</div>
            </div>
        </div>
    );
}
