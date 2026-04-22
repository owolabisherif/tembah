import { cn } from '@/lib/utils';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { t } from 'i18next';
import { SquareIcon, UserIcon } from 'lucide-react';
import { PropsWithChildren, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type SubMenuType = {
    title: string;
    description: string;
    icon: any;
    href: string;
};

interface MegaMenuType {
    title: string;
    description?: string;
    type: 'mega' | 'link';
    icon: any;
    href?: string;
    subMenus?: {
        header?: string;
        cols: SubMenuType[][];
    }[];
    command?: Function;
}

export default function NavGuest({ children }: PropsWithChildren) {
    const { auth } = usePage<SharedData>().props;
    const [selectedMenu, setSelectedMenu] = useState<MegaMenuType | null>(null);
    const megaMenu = useRef(null);

    const menus: MegaMenuType[] = [
        {
            title: t('Home'),
            icon: null,
            type: 'link',
            href: route('home'),
        },
        {
            title: t('Latest'),
            icon: SquareIcon,
            type: 'mega',
            command: (menu: MegaMenuType) => {
                handleMenuUpdate(menu);
            },
            subMenus: [
                {
                    header: '',
                    cols: [
                        [
                            {
                                title: 'News',
                                description: 'Meet and learn about our dedication',
                                icon: UserIcon,
                                href: route('home'),
                            },
                            {
                                title: 'Transfer News',
                                description: 'Meet and learn about our dedication',
                                icon: UserIcon,
                                href: route('home'),
                            },
                            {
                                title: 'Video News',
                                description: 'Meet and learn about our dedication',
                                icon: UserIcon,
                                href: route('home'),
                            },
                        ],
                    ],
                },
                // {
                //     header: 'Test header 2',
                //     cols: [
                //         [
                //             {
                //                 title: 'News 1',
                //                 description: 'Meet and learn about our dedication',
                //                 icon: UserIcon,
                //                 href: route('home'),
                //             },
                //             {
                //                 title: 'Transfer News 2',
                //                 description: 'Meet and learn about our dedication',
                //                 icon: UserIcon,
                //                 href: route('home'),
                //             },
                //             {
                //                 title: 'Table 3',
                //                 description: 'Meet and learn about our dedication',
                //                 icon: UserIcon,
                //                 href: route('home'),
                //             },
                //             {
                //                 title: 'Video News 4',
                //                 description: 'Meet and learn about our dedication',
                //                 icon: UserIcon,
                //                 href: route('home'),
                //             },
                //         ],
                //     ],
                // },
            ],
        },
        {
            title: t('Matches'),
            description: 'Find the perfect solution for your needs.',
            icon: SquareIcon,
            type: 'mega',
            command: (menu: MegaMenuType) => {
                handleMenuUpdate(menu);
            },
            subMenus: [
                {
                    // header: 'Test header 2',
                    cols: [
                        [
                            {
                                title: 'Live',
                                description: 'Meet and learn about our dedication',
                                icon: UserIcon,
                                href: route('home'),
                            },
                            {
                                title: 'Today',
                                description: 'Meet and learn about our dedication',
                                icon: UserIcon,
                                href: route('home'),
                            },
                            {
                                title: 'Tommorrow',
                                description: 'Meet and learn about our dedication',
                                icon: UserIcon,
                                href: route('home'),
                            },
                            {
                                title: 'Yesterday',
                                description: 'Meet and learn about our dedication',
                                icon: UserIcon,
                                href: route('home'),
                            },
                        ],
                    ],
                },
            ],
        },
        // {
        //     title: 'Leagues',
        //     description: 'Reach out to us for assistance or inquiries',
        //     icon: UserIcon,
        //     type: 'link',
        //     href: route('home'),
        // },
        // {
        //     title: 'Clubs',
        //     description: 'Reach out to us for assistance or inquiries',
        //     icon: UserIcon,
        //     type: 'link',
        //     href: route('home'),
        // },
        // {
        //     title: 'Players',
        //     type: 'link',
        //     description: 'Find the perfect solution for your needs.',
        //     icon: UserIcon,
        //     href: route('home'),
        // },
    ];

    const handleMenuUpdate = (menu: MegaMenuType) => {
        if (selectedMenu?.title == menu.title) {
            setSelectedMenu(null);
            document.body.classList.remove('no-scrollbar');
            document.documentElement.classList.remove('overflow-x-hidden');
            document.body.classList.remove('no-scroll');
        } else {
            setSelectedMenu(menu);
            document.body.classList.add('no-scrollbar');
            document.documentElement.classList.add('overflow-x-hidden');
            document.body.classList.add('no-scroll');
        }
    };

    const handleMenuReset = () => {
        setSelectedMenu(null);
        document.documentElement.classList.remove('overflow-x-hidden');
        document.body.classList.remove('no-scrollbar');
        document.body.classList.remove('no-scroll');
    };

    return (
        <>
            <nav
                className={cn('relative z-[120] mb-3 flex justify-between overflow-hidden rounded-b-md border-t border-white bg-blue-950')}
                dir="ltr"
            >
                <div className="relative flex w-full justify-end gap-x-10 pr-5">
                    {menus.map((item) =>
                        item.type == 'link' ? (
                            <Link
                                key={item.title}
                                href={item.href!}
                                className="cursor-pointer p-2 text-[18px] font-bold text-white hover:text-red-500"
                            >
                                {item.title}
                            </Link>
                        ) : (
                            <button
                                className="cursor-pointer p-2 text-[18px] font-bold text-white hover:text-red-500"
                                id="popoverTrig"
                                onClick={() => handleMenuUpdate(item)}
                                ref={megaMenu}
                                key={item.title}
                            >
                                {item.title}
                            </button>
                        ),
                    )}

                    {selectedMenu && (
                        <div className="fixed right-0 -left-2 mt-10.5 h-auto w-full rounded-sm transition-all" id="popover">
                            <div className="grid h-full w-full grid-cols-12">
                                <div className="col-span-2 h-full" onClick={() => handleMenuReset()}></div>
                                <div className="col-span-8 h-full rounded-sm bg-blue-950 p-5 shadow-lg">
                                    <h1 className="mb-5 font-extrabold text-white">{selectedMenu.title}</h1>
                                    <div className="grid grid-cols-12 gap-y-5 px-5">
                                        {selectedMenu.subMenus!.map((menu, index) => (
                                            <div className={cn(`col-span-${selectedMenu.subMenus?.length! > 1 ? '3' : '12'}`)} key={index}>
                                                {menu.header && <h3 className="mb-2 font-black text-red-500">{menu.header}</h3>}
                                                {menu.cols.map((rows, index) => (
                                                    <div key={index}>
                                                        {rows.map((item) => (
                                                            <p className="mb-3" key={item.title}>
                                                                <Link
                                                                    key={item.title}
                                                                    href={item.href}
                                                                    className="font-medium text-white hover:text-red-500"
                                                                >
                                                                    {item.title}
                                                                </Link>
                                                            </p>
                                                        ))}
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="col-span-2 h-full" onClick={() => handleMenuReset()}></div>
                            </div>
                        </div>
                    )}
                </div>
            </nav>
            {selectedMenu &&
                createPortal(
                    <div
                        className="absolute top-0 right-0 left-0 z-[100] h-screen w-screen overflow-x-hidden overflow-y-hidden bg-white/5"
                        onClick={() => handleMenuReset()}
                    ></div>,
                    document.body,
                )}
        </>
    );
}
