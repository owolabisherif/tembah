import { Adtype } from '@/pages/partials/ad';
import { Fade } from 'react-slideshow-image';

export default function HeaderAd() {
    const images: Adtype[] = [
        {
            id: 1,
            url: route('home'),
            imageUrl: '/assets/ads/1gif.png',
        },
        {
            id: 2,
            url: route('home'),
            imageUrl: '/assets/ads/2gif.png',
        },
        {
            id: 3,
            url: route('home'),
            imageUrl: '/assets/ads/3gif.png',
        },
    ];

    return (
        <Fade arrows={false} duration={2000} transitionDuration={6000} cssClass="h-20 w-full p-0">
            {images.map((image) => (
                <a className="block h-20 w-full" key={image.id} href={image.url}>
                    <img src={image.imageUrl} className="h-full w-full object-fill object-center" />
                </a>
            ))}
        </Fade>
    );
}
