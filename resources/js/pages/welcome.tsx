import { useIsMobile } from '@/hooks/use-mobile';
import GuestLayout from '@/layouts/guest-layout';
import { t } from 'i18next';
import Ad from './partials/ad';
import Articles from './partials/articles';
import CategoryNews from './partials/category-news';
import GetOurApp from './partials/get-our-app';
import LatestNews from './partials/latest-news';
import NewsletterPage from './partials/newsletter';
import SliderHome from './partials/slider-home';
import UpcomingMatches from './partials/upcoming-matches';

type WelcomeProp = {
    news: any;
    topNews: any;
    recentNews: any;
    sliders: any;
};

export default function Welcome() {
    const isMobile = useIsMobile();

    return (
        <>
            {isMobile ? (
                <GuestLayout>
                    <SliderHome />
                    <div className="mt-5 w-full">
                        <UpcomingMatches />
                        <Ad />
                        <LatestNews />
                        <Ad />
                        <Articles />
                        <div className="mt-5 rounded-sm border border-neutral-100 p-5 shadow-md">
                            <NewsletterPage />
                        </div>
                    </div>
                </GuestLayout>
            ) : (
                <GuestLayout title={t('Welcome')}>
                    <SliderHome />
                    <UpcomingMatches />
                    <Ad />
                    <LatestNews />
                    {/* <Ad />
                    <VideoNews /> */}
                    <Ad />
                    <Articles />
                    <CategoryNews />
                    <GetOurApp />
                </GuestLayout>
            )}
        </>
    );
}
