import SocialIcons from '@/components/ui/social-icons';
import GuestLayout from '@/layouts/guest-layout';
import { Link } from '@inertiajs/react';
import { t } from 'i18next';
import {
    ArrowLeftRightIcon,
    BadgeInfoIcon,
    CookieIcon,
    FileTextIcon,
    LockKeyholeIcon,
    MailCheckIcon,
    MegaphoneIcon,
    PhoneCallIcon,
} from 'lucide-react';

type MoreLinks = {
    text: string;
    url: string;
    icon: any;
};

export default function More() {
    const links: MoreLinks[] = [
        {
            text: 'About us',
            url: route('pages', { slug: 'about-us' }),
            icon: BadgeInfoIcon,
        },
        {
            text: 'Advertise',
            url: route('pages', { slug: 'advertise-with-us' }),
            icon: MegaphoneIcon,
        },
        {
            text: 'Transfer center',
            url: route('index.transfer.center'),
            icon: ArrowLeftRightIcon,
        },
        {
            text: 'Cookie policy',
            url: route('pages', { slug: 'cookie' }),
            icon: CookieIcon,
        },
        {
            text: 'Terms of use',
            url: route('pages', { slug: 'terms-of-use' }),
            icon: FileTextIcon,
        },
        {
            text: 'Privacy policy',
            url: route('pages', { slug: 'privacy-policy' }),
            icon: LockKeyholeIcon,
        },
    ];
    return (
        <GuestLayout title={t('More')}>
            <div className="flex h-screen w-full flex-col overflow-y-hidden rounded-sm bg-gray-400 p-5 dark:bg-neutral-800">
                <div>
                    {links.map((link) => (
                        <Link href={link.url} className="mb-5 flex gap-x-3 hover:text-gray-500" key={link.text}>
                            <link.icon />
                            <p>{link.text}</p>
                        </Link>
                    ))}
                </div>

                <div className="flex flex-col gap-y-3">
                    <p className="font-bold">{t('Follow us')}</p>
                    <div className="mb-2 flex flex-col gap-y-2">
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
            </div>
        </GuestLayout>
    );
}
