import SocialIcons from '@/components/ui/social-icons';
import { Link } from '@inertiajs/react';
import { t } from 'i18next';
import { MailCheckIcon, PhoneCallIcon } from 'lucide-react';
import NewsletterPage from './newsletter';

export default function Footer() {
    return (
        <>
            <div className="mx-auto mt-10 hidden h-80 w-full bg-gray-900 p-10 text-white md:block">
                <div className="grid grid-cols-12">
                    <div className="col-span-3 flex flex-col gap-y-3">
                        <div className="mb-10 w-52">
                            <img src="/assets/images/logo.png" alt="Tembah logo" className="h-full w-full" />
                        </div>
                        <p className="mb-1 font-bold">{t('Follow us')}</p>
                        <div className="mb-2 flex flex-col">
                            <div className="juce flex items-center gap-x-1">
                                <PhoneCallIcon className="w-4" />
                                <p className="text-xs font-bold" dir="ltr">
                                    +974 854 6745
                                </p>
                            </div>
                            <div className="juce flex items-center gap-x-1">
                                <MailCheckIcon className="w-4" />
                                <p className="text-xs font-bold" dir="ltr">
                                    info@tembah.net
                                </p>
                            </div>
                        </div>
                        <SocialIcons />
                    </div>
                    <div className="col-span-3">
                        <div className="flex flex-col">
                            <div className="flex flex-col gap-y-3">
                                <Link href={route('home')} className="font-bold">
                                    {t('Home')}
                                </Link>
                                <Link href={route('pages', { slug: 'about-us' })} className="font-bold">
                                    {t('About us')}
                                </Link>
                                <Link href={route('index.transfer.center')} className="font-bold">
                                    {t('Transfer center')}
                                </Link>
                                <Link href={route('pages', { slug: 'terms-of-use' })} className="font-bold">
                                    {t('Terms of use')}
                                </Link>
                                <Link href={route('pages', { slug: 'advertise' })} className="font-bold">
                                    {t('Advertise')}
                                </Link>
                                <Link href={route('pages', { slug: 'cookie' })} className="font-bold">
                                    {t('Cookie policy')}
                                </Link>
                                <Link href={route('pages', { slug: 'privacy-policy' })} className="font-bold">
                                    {t('Privacy policy')}
                                </Link>
                            </div>
                        </div>
                    </div>
                    {/* <div className="col-span-3">
                        <div className="flex flex-col">
                            <div className="flex flex-col gap-y-3">
                                <Link href={route('home')} className="font-bold">
                                    {t('More custome pages')}
                                </Link>
                            </div>
                        </div>
                    </div> */}
                    <div className="col-span-3">
                        <div className="flex flex-col">
                            <div className="w-full">
                                <NewsletterPage />
                                <p className="mt-10 text-xs">
                                    <span className="font-bold text-red-500">{t('Note')}:</span>{' '}
                                    {t(
                                        'It is not allowed to employ automatic services (such as crawlers, robots, indexing, etc. or other techniques on a regular or systematic basis.)',
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="hidden items-center justify-between bg-red-600 p-1 text-white md:flex">
                <p className="font-xs text-xs font-bold">{t('Copyright © 2025 All rights reserved.')}</p>
                <p className="text-xs">
                    <span className="text-xs font-bold">{t('Made with ❤️ by:')}</span> <a href="https://emqatar.com">{t('Echo Media')}</a>
                </p>
            </div>
        </>
    );
}
