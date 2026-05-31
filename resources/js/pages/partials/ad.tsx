import { t } from 'i18next';
import { Fade } from 'react-slideshow-image';

export type Adtype = {
    id: number;
    url: string;
    imageUrl: string;
    altText: string;
};

type AdType = {
    type?: 'ver' | 'hor';
};

export default function Ad({ type = 'hor' }: AdType) {
    const images: Adtype[] = [
        {
            id: 1,
            url: route('home'),
            imageUrl: '/assets/ads/1gif.png',
            altText: 'image 1',
        },
        {
            id: 2,
            url: route('home'),
            imageUrl: '/assets/ads/2gif.png',
            altText: 'image 1',
        },
        {
            id: 3,
            url: route('home'),
            imageUrl: '/assets/ads/3gif.png',
            altText: 'image 1',
        },
    ];

    const verImages: Adtype[] = [
        {
            id: 1,
            url: route('home'),
            imageUrl: '/assets/images/poster.png',
            altText: 'image 1',
        },
        {
            id: 2,
            url: route('home'),
            imageUrl: '/assets/images/poster.png',
            altText: 'image 1',
        },
        {
            id: 3,
            url: route('home'),
            imageUrl: '/assets/images/poster.png',
            altText: 'image 1',
        },
    ];

    return (
        <>
            {type == 'hor' ? (
                <div className="relative z-0 h-32 w-full overflow-hidden rounded-sm md:h-52">
                    <Fade arrows={false} duration={500} transitionDuration={1000}>
                        {images.map((image) => (
                            <a className="block h-52 w-full rounded-sm" key={image.id} href={image.url}>
                                <img src={image.imageUrl} className="h-full w-full" alt={image.altText} />
                            </a>
                        ))}
                    </Fade>
                    <div className="absolute top-2 left-2 z-50 m-1 rounded-full bg-red-500 px-1 py-0.5">
                        <p className="text-xs font-bold text-white">{t('Advertisement')}</p>
                    </div>
                </div>
            ) : (
                <div className="relative h-full w-full overflow-hidden rounded-sm">
                    <Fade arrows={false} duration={500} transitionDuration={1000} cssClass="!h-full">
                        {verImages.map((image) => (
                            <a className="block h-full w-full rounded-sm" key={image.id} href={image.url}>
                                <img src={image.imageUrl} className="h-full w-full" alt={image.altText} />
                            </a>
                        ))}
                    </Fade>
                    <div className="absolute top-2 left-2 z-50 m-1 rounded-full bg-red-500 px-1 py-0.5">
                        <p className="text-xs font-bold text-white">{t('Advertisement')}</p>
                    </div>
                </div>
            )}
        </>
    );
}
