import { Breadcrumbs } from '@/components/breadcrumbs';
import HeaderAd from '@/components/header-ad';
import NavGuest from '@/components/nav-guest';
import Dropdown from '@/components/ui/dropdown';
import SocialIcons from '@/components/ui/social-icons';
import { Appearance, useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';
import AsideAd from '@/pages/partials/aside-ad';
import Footer from '@/pages/partials/footer';
import MobileFooter from '@/pages/partials/mobile-footer';
import { Head, Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import i18next from 'i18next';
import { MailCheckIcon, Monitor, MoonIcon, PhoneCallIcon, SunIcon, UserCogIcon } from 'lucide-react';
import { PropsWithChildren, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type GuestLayout = {
    title?: string;
    breadcrumbs?: any[];
};

export default function GuestLayout({ title = 'Welcome', breadcrumbs, children }: PropsWithChildren<GuestLayout>) {
    const [lang, setLang] = useState('ar');
    const [theme, setTheme] = useState<Appearance>('light');
    const { i18n } = useTranslation();
    const { appearance, updateAppearance } = useAppearance();

    const page = usePage();

    let activeClass =
        'cursor-pointer bg-blue-950 px-2 py-1 font-bold text-white transition shadow-2xl text-xs dark:bg-neutral-800 hover:dark:bg-neutral-700';
    let inActiveClass =
        'cursor-pointer bg-gray-200 px-2 py-1 font-bold text-black shadow-2xl text-xs hover:dark:bg-neutral-700 hover:dark:text-white';

    useEffect(() => {
        // const storedLang = localStorage.getItem('lang');
        const storedTheme = localStorage.getItem('appearance') as Appearance | null;

        setTheme(storedTheme ?? 'system');

        // updateLang(storedLang ?? 'ar');
    }, []);

    const handleManualLangChange = async (lng: string) => {
        setLang(lng);
        await updateLang(lng);
        localStorage.setItem('lang', lng);
        getRoute(lng);

        reloadPage(lng);
    };

    useEffect(() => {
        document.documentElement.dir = i18n.dir(i18n.language);
        document.documentElement.lang = i18n.language;
    }, [i18n, i18n.language]);

    useEffect(() => {
        handleLanInit();
    }, []);

    const handleLanInit = async () => {
        const { pathname, searchParams } = new URL(window.location.href);
        const rtArray = pathname.trim().split('/');
        const lang = rtArray.pop();
        let langs = ['ar', 'en'];

        const storedLang = localStorage.getItem('lang') ?? 'ar';

        if (storedLang != page.props.lang) {
            await updateLang(storedLang);
            reloadPage(storedLang);
        }

        setLang(storedLang);

        if (!lang) {
            // updateLang(storedLang);
            reloadPage(storedLang);
            return;
        }

        if (!langs.includes(lang)) {
            window.location.href = pathname + '/' + storedLang;
            return;
        }

        if (lang != storedLang) {
            localStorage.setItem('lang', lang);
            setLang(lang);
            updateLang(lang);
        }
    };

    const getRoute = (lng: string): string => {
        let rt = '';

        const { pathname, searchParams } = new URL(window.location.href);
        const rtArray = pathname.trim().split('/');
        rtArray.pop();
        rtArray.shift();

        const isHomePage = !rtArray.length;

        if (isHomePage) {
            rt = `/${lng}`;
        } else {
            rt = `/${rtArray.join('/')}/${lng}`;
        }

        if (searchParams.has('tab')) {
            rt += `?tab=${searchParams.get('tab')}`;
        }

        return rt;
    };

    const reloadPage = (lng: string) => {
        const rt = getRoute(lng);

        window.location.href = rt;
    };

    const handleSetTheme = (theme: Appearance) => {
        setTheme(theme);
        updateAppearance(theme);
        localStorage.setItem('appearance', theme);
    };

    const updateLang = async (lng: string) => {
        await i18next.changeLanguage(lng);

        await axios.get(route('prefLang', { lang: lng }));
    };

    return (
        <>
            <Head title={title ? `${title}` : 'Welcome'}>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div className="mx-auto mt-1 mb-20 md:mb-0 md:bg-[#FDFDFC] dark:bg-black">
                <main className="grid grid-cols-12 md:gap-x-1">
                    <aside className="relative col-span-2 hidden pl-10 md:block">
                        <AsideAd pos="left" />
                    </aside>

                    <main className="no-scrollbar col-span-12 px-1 md:col-span-8 md:px-0">
                        <div
                            className="relative z-50 flex items-center justify-end rounded-t-sm bg-gray-300 px-2 py-1 md:justify-between dark:border-b dark:border-b-gray-500 dark:bg-neutral-800"
                            dir="ltr"
                        >
                            <SocialIcons className="hidden md:flex" />
                            <div className="flex gap-x-2">
                                <div className="hidden items-center gap-x-1 md:flex">
                                    <PhoneCallIcon className="w-4" />
                                    <p className="text-xs font-bold">+974 854 6745</p>
                                </div>
                                <div className="hidden items-center gap-x-1 md:flex">
                                    <MailCheckIcon className="w-4" />
                                    <p className="text-xs font-bold">info@tembah.net</p>
                                </div>
                                <div className="flex">
                                    <button
                                        className={cn(lang == 'en' ? activeClass : inActiveClass, 'rounded-l-sm')}
                                        onClick={() => handleManualLangChange('en')}
                                    >
                                        En
                                    </button>
                                    <button
                                        className={cn(lang == 'ar' ? activeClass : inActiveClass, 'rounded-r-sm')}
                                        onClick={() => handleManualLangChange('ar')}
                                    >
                                        العربية
                                    </button>
                                </div>

                                <div className="flex gap-x-1">
                                    <button
                                        className="flex cursor-pointer items-center justify-center rounded-sm bg-blue-950 px-1 py-0.5 hover:bg-blue-900 dark:bg-neutral-800 hover:dark:bg-neutral-700"
                                        onClick={() => handleSetTheme(theme == 'light' ? 'dark' : theme == 'dark' ? 'system' : 'light')}
                                    >
                                        {theme == 'light' ? (
                                            <MoonIcon className="w-4.5 cursor-pointer text-gray-200" />
                                        ) : theme == 'dark' ? (
                                            <SunIcon className="w-4.5 cursor-pointer text-yellow-200" />
                                        ) : (
                                            <Monitor className="w-4.5 cursor-pointer text-white" />
                                        )}
                                    </button>
                                </div>
                                {/* <div className="flex gap-x-1">
                                    <button
                                        className="flex cursor-pointer items-center justify-center rounded-sm bg-blue-950 px-1 py-0.5 hover:bg-blue-900"
                                        onClick={() => handleSetTheme(theme == 'light' ? 'dark' : 'light')}
                                    >
                                        <BellDotIcon className="w-4.5 cursor-pointer text-gray-200" />
                                    </button>
                                </div> */}
                                <button className="hidden cursor-pointer items-center justify-center rounded-sm bg-blue-950 px-1 py-0.5 hover:bg-blue-900 md:flex dark:bg-neutral-800 hover:dark:bg-neutral-700">
                                    <Dropdown>
                                        <UserCogIcon className="w-5 text-white" />
                                    </Dropdown>
                                </button>
                            </div>
                        </div>
                        <header
                            className="relative z-50 mb-2 h-20 w-full overflow-hidden rounded-b-sm bg-white text-sm shadow-sm not-has-[nav]:hidden md:mb-0 md:rounded-b-none md:bg-red-500 dark:border-b dark:bg-neutral-800"
                            dir="ltr"
                        >
                            <nav className="flex h-20 w-full">
                                <div className="flex w-24 items-center justify-center md:w-96 md:justify-start">
                                    <Link className="w-full p-2 md:w-56 md:p-5" href={route('home')}>
                                        <img src="/assets/images/logo.png" alt="Tembah logo" className="hidden h-full w-full md:block" />
                                        <img src="/assets/images/logo2.png" alt="Tembah logo" className="block h-full w-full md:hidden" />
                                    </Link>
                                </div>
                                <div
                                    className="h-20 w-full flex-1 overflow-hidden shadow-sm"
                                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 6% 100%)' }}
                                >
                                    <HeaderAd />
                                </div>
                            </nav>
                        </header>
                        <NavGuest />
                        {breadcrumbs && (
                            <div className="my-5 hidden md:block">
                                <Breadcrumbs breadcrumbs={breadcrumbs} />
                            </div>
                        )}
                        {children}
                    </main>
                    <aside className="relative col-span-2 hidden md:block">
                        <AsideAd pos="right" />
                    </aside>
                </main>
            </div>
            <Footer />
            <MobileFooter />
        </>
    );
}
