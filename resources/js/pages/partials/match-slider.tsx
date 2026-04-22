import MatchCard from '@/components/match-card';
import SlickSlider from '@/components/slick-slider';
import PageNotFound from '@/components/svgs/page-not-found';
import { FixtureMatch } from '@/types/match';

type MatchSliderProp = {
    showArrow: boolean;
    autoplay: boolean;
    matches: FixtureMatch[];
    initialSlide?: number;
};

export default function MatchSlider({ showArrow = false, autoplay = true, matches = [], initialSlide = 0 }: MatchSliderProp) {
    return matches.length ? (
        <SlickSlider showArrow={showArrow} autoplay={autoplay} initialSlide={initialSlide}>
            {matches.map((item, index) => (
                <MatchCard {...item} key={index} />
            ))}
        </SlickSlider>
    ) : (
        <div className="flex flex-col items-center justify-center">
            <PageNotFound />
            <div className="mt-5">
                <h3 className="text-xs font-bold text-black">Nothing here, please check back.</h3>
            </div>
        </div>
    );
}
