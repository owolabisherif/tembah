import { cn } from '@/lib/utils';
import i18next from 'i18next';
import React, { useRef } from 'react';
import Facebook from '../svgs/facebook';
import LinkedIn from '../svgs/linkedin';
import Telegram from '../svgs/telegram';
import Whatsapp from '../svgs/whatsapp';
import X from '../svgs/x';
import { News } from '@/types/news';
import Google from '../svgs/google';

type NewsProp = {
    news: News;
    url: string
    className?: string
};

type SocialType = {
    label: string;
    icon: React.ReactNode;
    hoverColor: string;
    url: string;
};
export default function ShareButtons(prop: NewsProp, ) {
    const { news, url, className = "flex w-full flex-wrap justify-start gap-5" } = prop;

    const socials = useRef<SocialType[]>([
        {
            label: 'Facebook',
            icon: <Facebook classData="w-7" />,
            hoverColor: 'hover:text-blue-500 bg-blue-50  hover:shadow-md',
            url: `https://www.facebook.com/sharer/sharer.php?u=${url}&title=${
                news.title
            }&description=${news.body?.slice(0, 30)}...`,
        },
        {
            label: 'Whatsapp',
            icon: <Whatsapp classData="w-6" />,
            hoverColor: 'hover:text-green-300 bg-green-50 hover:shadow-md',
            url: `https://api.whatsapp.com/send?text=${news.title}%0D%0A${url}%0D%0A${news.body?.slice(0, 30)}...`,
        },
        {
            label: 'Telegram',
            icon: <Telegram classData="w-8" />,
            hoverColor: 'hover:text-blue-500 bg-blue-50 hover:shadow-md',
            url: `https://t.me/share/url?url=${url}&text=${news.title}%0D%0A${news.body?.slice(0, 30)}...`,
        },
        {
            label: 'LinkedIn',
            icon: <LinkedIn classData="w-8" />,
            hoverColor: 'hover:text-blue-400 bg-blue-50 hover:shadow-md',
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
        },
        {
            label: 'X',
            icon: <X classData="w-8" />,
            hoverColor: 'hover:text-black bg-gray-50 hover:shadow-md',
            url: `https://twitter.com/intent/tweet?text=${news.title}&url=${url}`,
        },
        {
            label: 'Google',
            icon: <Google classData="w-8" />,
            hoverColor: 'hover:text-black bg-gray-50 hover:shadow-md',
            url: `https://www.google.com/preferences/source?q=tembah.net`,
        },
    ]);

    return (
        <>
            <div className={cn(className)}>
                {socials.current.map((item) => (
                    <a
                        href={item.url}
                        key={item.label}
                        className={cn('flex h-10 w-10 items-center justify-center rounded-md border border-green-50 shadow-sm', item.hoverColor)}
                        target="_blank"
                    >
                        {item.icon}
                    </a>
                ))}
            </div>
        </>
    );
}
