import GuestLayout from '@/layouts/guest-layout';
import Ad from './partials/ad';
import Articles from './partials/articles';
import CategoryNews from './partials/category-news';
import GetOurApp from './partials/get-our-app';
import LatestNews from './partials/latest-news';
import SliderHome from './partials/slider-home';
import UpcomingMatches from './partials/upcoming-matches';
import VideoNews from './partials/video-news';

export default function Welcome() {
    // console.log(navigator.language);

    return (
        <GuestLayout>
            <SliderHome />
            <UpcomingMatches />
            <Ad />
            <LatestNews />
            <Ad />
            <VideoNews />
            <Ad />
            <Articles />
            <CategoryNews />
            <GetOurApp />
        </GuestLayout>
    );
}
