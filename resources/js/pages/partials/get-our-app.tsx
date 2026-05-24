import { Link } from '@inertiajs/react';
import { t } from 'i18next';

export default function GetOurApp() {
    return (
        <div className="my-16">
            <div className="mt-30 h-64 w-full justify-center rounded-sm bg-blue-950 pr-44 pl-20 shadow-sm">
                <div className="flex h-full items-center justify-center">
                    <div className="flex-1 p-24 pl-5">
                        <h2 className="text-3xl font-black text-white">{t('Instant Football News At Your Finger Tip')}</h2>
                        <p className="text-white">{t('Download our app today on play store and app store.')}</p>
                        <div className="bl mt-10 flex gap-x-5">
                            <Link className="w-52" href="#">
                                <img src="/assets/images/playstore.webp" alt="playstore" />
                            </Link>
                            <Link className="w-52" href="#">
                                <img src="/assets/images/appstore.webp" alt="appstore" />
                            </Link>
                        </div>
                    </div>
                    <div className="h-full w-96">
                        <div className="flex h-full items-center justify-center gap-x-2">
                            <div className="w-full">
                                <img src="/assets/images/phone.png" className="h-full w-full" alt="" />
                            </div>
                            <div className="w-full">
                                <img src="/assets/images/phone.png" className="h-full w-full" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
