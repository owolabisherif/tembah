import { Link } from '@inertiajs/react';
import { t } from 'i18next';
import { HomeIcon, MenuIcon, NewspaperIcon, SportShoe, TrophyIcon, TvIcon } from 'lucide-react';

export default function MobileFooter() {
    return (
        <div className="fixed right-0 bottom-1 left-0 z-50 block h-15 px-1 md:hidden">
            <div className="relative flex h-full w-full justify-between gap-x-2 rounded-full border-white bg-gradient-to-t from-blue-950 to-blue-900 px-1 dark:from-neutral-800 dark:to-neutral-700">
                <div className="absolute -top-10 right-0 left-0">
                    <Link href={route('live.scores')} className="flex h-full w-full justify-center">
                        <div className="flex aspect-auto size-12 shrink-0 flex-col items-center justify-center rounded-full border border-blue-900 bg-white p-3.5 shadow-md shadow-blue-900 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-neutral-900">
                            <TvIcon className="size-full text-blue-950 dark:text-white" />
                        </div>
                    </Link>
                </div>
                <div className="flex h-full flex-1 flex-col items-center justify-center">
                    <Link href={route('home')} className="flex flex-col items-center justify-center">
                        <HomeIcon className="w-5 text-white" />
                        <p className="text-xs font-bold text-white">{t('Home')}</p>
                    </Link>
                </div>
                <div className="flex h-full flex-1 flex-col items-center justify-center">
                    <Link href={route('text.news.index')} className="flex flex-col items-center justify-center">
                        <NewspaperIcon className="w-5 text-white" />
                        <p className="text-xs font-bold text-white">{t('News')}</p>
                    </Link>
                </div>

                <div className="flex h-full flex-1 flex-col items-center justify-center">
                    <Link href={route('mobile.leagues')} className="flex flex-col items-center justify-center">
                        <TrophyIcon className="w-5 text-white" />
                        <p className="text-xs font-bold text-white">{t('Leagues')}</p>
                    </Link>
                </div>
                <div className="flex h-full flex-1 flex-col items-center justify-center">
                    <Link href={route('soccer.matches', { period: 'home' })} className="flex flex-col items-center justify-center">
                        <SportShoe className="w-5 text-white" />
                        <p className="text-xs font-bold text-white">{t('Matches')}</p>
                    </Link>
                </div>
                <div className="flex h-full flex-1 flex-col items-center justify-center">
                    <Link href={route('mobile.more')} className="flex flex-col items-center justify-center">
                        <MenuIcon className="w-5 text-white" />
                        <p className="text-xs font-bold text-white">{t('More')}</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}
