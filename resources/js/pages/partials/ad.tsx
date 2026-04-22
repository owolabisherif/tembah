import { Fade } from 'react-slideshow-image';

export type Adtype = {
    id: number;
    url: string;
    imageUrl: string;
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

    const verImages: Adtype[] = [
        {
            id: 1,
            url: route('home'),
            imageUrl: '/assets/images/poster.png',
        },
        {
            id: 2,
            url: route('home'),
            imageUrl: '/assets/images/poster.png',
        },
        {
            id: 3,
            url: route('home'),
            imageUrl: '/assets/images/poster.png',
        },
    ];

    return (
        <>
            {type == 'hor' ? (
                <div className="relative h-52 w-full overflow-hidden rounded-sm">
                    <Fade arrows={false} duration={500} transitionDuration={1000}>
                        {images.map((image) => (
                            <a className="block h-52 w-full rounded-sm" key={image.id} href={image.url}>
                                <img src={image.imageUrl} className="h-full w-full" />
                            </a>
                        ))}
                    </Fade>
                    <div className="absolute top-2 left-2 z-50 m-1 rounded-full bg-red-500 px-1 py-0.5">
                        <p className="text-xs font-bold text-white">Advertisement</p>
                    </div>
                </div>
            ) : (
                <div className="relative h-full w-full overflow-hidden rounded-sm">
                    <Fade arrows={false} duration={500} transitionDuration={1000} cssClass="!h-full">
                        {verImages.map((image) => (
                            <a className="block h-full w-full rounded-sm" key={image.id} href={image.url}>
                                <img src={image.imageUrl} className="h-full w-full" />
                            </a>
                        ))}
                    </Fade>
                    <div className="absolute top-2 left-2 z-50 m-1 rounded-full bg-red-500 px-1 py-0.5">
                        <p className="text-xs font-bold text-white">Advertisement</p>
                    </div>
                </div>
            )}
        </>
    );
}
