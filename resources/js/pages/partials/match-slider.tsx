import MatchCard from '@/components/match-card';
import SlickSlider from '@/components/slick-slider';
import PageNotFound from '@/components/svgs/page-not-found';
import { FixtureMatch } from '@/types/match';
import { t } from 'i18next';

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
                <h3 className="text-xs font-bold text-black">{t('No information to show. Please try again.')}</h3>
            </div>
        </div>
    );
}
