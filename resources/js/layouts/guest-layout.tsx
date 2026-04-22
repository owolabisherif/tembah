import HeaderAd from '@/components/header-ad';
import NavGuest from '@/components/nav-guest';
import Dropdown from '@/components/ui/dropdown';
import SocialIcons from '@/components/ui/social-icons';
import { Appearance, useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';
import AsideAd from '@/pages/partials/aside-ad';
import Footer from '@/pages/partials/footer';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import i18next from 'i18next';
import { MailCheckIcon, Monitor, MoonIcon, PhoneCallIcon, SunIcon, UserCogIcon } from 'lucide-react';
import { PropsWithChildren, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function GuestLayout({ children }: PropsWithChildren) {
    const [lang, setLang] = useState('ar');
    const [theme, setTheme] = useState<Appearance>('light');
    const { i18n } = useTranslation();
    const { appearance, updateAppearance } = useAppearance();

    let activeClass = 'cursor-pointer bg-blue-950 px-2 py-1 font-bold text-white transition shadow-2xl text-xs';
    let inActiveClass = 'cursor-pointer bg-gray-200 px-2 py-1 font-bold text-black shadow-2xl text-xs';

    useEffect(() => {
        const storedLang = localStorage.getItem('lang');
        const storedTheme = localStorage.getItem('appearance') as Appearance | null;

        setLang(storedLang ?? 'ar');
        setTheme(storedTheme ?? 'system');

        updateLang(storedLang ?? 'ar');
    }, []);

    const handleManualLangChange = (lng: string) => {
        setLang(lng);
        localStorage.setItem('lang', lng);
        getRoute(lng);
        updateLang(lng);

        reloadPage(lng);
    };

    useEffect(() => {
        document.documentElement.dir = i18n.dir(i18n.language);
        document.documentElement.lang = i18n.language;
    }, [i18n, i18n.language]);

    useEffect(() => {
        const { pathname, searchParams } = new URL(window.location.href);
        const rtArray = pathname.trim().split('/');
        const lang = rtArray.pop();
        let langs = ['ar', 'en'];

        const storedLang = localStorage.getItem('lang');

        if (!lang) {
            window.location.href = getRoute(storedLang ?? 'ar');
            return;
        }

        if (!langs.includes(lang)) {
            window.location.href = pathname + '/' + (storedLang ?? 'ar');
            return;
        }

        if (lang != storedLang) {
            localStorage.setItem('lang', lang);
            setLang(lang);
            updateLang(lang);
        }
    }, []);

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

        router.get(rt);
    };

    const handleSetTheme = (theme: Appearance) => {
        setTheme(theme);
        updateAppearance(theme);
        localStorage.setItem('appearance', theme);
    };

    const updateLang = async (lng: string) => {
        await i18next.changeLanguage(lng);

        axios.get(route('prefLang', { lang: lng }));
    };

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="mx-auto mt-1 bg-[#FDFDFC]">
                <main className="grid grid-cols-12 gap-x-1">
                    <aside className="relative col-span-2 pl-10">
                        <AsideAd pos="left" />
                    </aside>

                    <main className="col-span-8">
                        <div className="relative z-50 flex items-center justify-between rounded-t-sm bg-gray-300 px-2 py-1" dir="ltr">
                            <SocialIcons />
                            <div className="flex gap-x-2">
                                <div className="juce flex items-center gap-x-1">
                                    <PhoneCallIcon className="w-4" />
                                    <p className="text-xs font-bold">+974 854 6745</p>
                                </div>
                                <div className="juce flex items-center gap-x-1">
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
                                        className="flex cursor-pointer items-center justify-center rounded-sm bg-blue-950 px-1 py-0.5 hover:bg-blue-900"
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
                                <button className="flex cursor-pointer items-center justify-center rounded-sm bg-blue-950 px-1 py-0.5 hover:bg-blue-900">
                                    <Dropdown>
                                        <UserCogIcon className="w-5 text-white" />
                                    </Dropdown>
                                </button>
                            </div>
                        </div>
                        <header className="relative z-50 h-20 w-full bg-red-500 text-sm not-has-[nav]:hidden" dir="ltr">
                            <nav className="flex h-20 w-full">
                                <div className="w-96">
                                    <div className="w-52 p-5">
                                        <img src="/assets/images/logo.png" alt="Tembah logo" className="h-full w-full" />
                                    </div>
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
                        {children}
                    </main>
                    <aside className="relative col-span-2">
                        <AsideAd pos="right" />
                    </aside>
                </main>
            </div>
            <Footer />
        </>
    );
}
