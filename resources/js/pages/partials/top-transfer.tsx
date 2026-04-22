import { cn } from '@/lib/utils';
import { Transfer } from '@/types/league';
import { Link } from '@inertiajs/react';
import { ArrowBigRightIcon, LucideArrowDownUp } from 'lucide-react';
import { useState } from 'react';

export default function TopTransfer() {
    var transfers: Transfer[] = [
        {
            id: 1,
            player: {
                id: 1,
                name: 'C. Ronaldo',
                imageUrl: '/assets/others/image1.jpg',
            },
            fromClub: {
                id: 1,
                name: 'Real madrid',
                imageUrl: '/assets/others/baca.webp',
            },
            toClub: {
                id: 1,
                name: 'Real madrid',
                imageUrl: '/assets/others/madrid.png',
            },
            date: '20-7-2025',
            amount: '$25M',
        },
        {
            id: 2,
            player: {
                id: 1,
                name: 'Mercy',
                imageUrl: '/assets/others/image2.jpg',
            },
            fromClub: {
                id: 1,
                name: 'Bacerlona',
                imageUrl: '/assets/others/madrid.png',
            },
            toClub: {
                id: 1,
                name: 'Real madrid',
                imageUrl: '/assets/others/baca.webp',
            },
            date: '20-7-2025',
            amount: '$35M',
        },
        {
            id: 3,
            player: {
                id: 1,
                name: 'Mercy',
                imageUrl: '/assets/others/image3.jpg',
            },
            fromClub: {
                id: 1,
                name: 'Bacerlona',
                imageUrl: '/assets/others/madrid.png',
            },
            toClub: {
                id: 1,
                name: 'Real madrid',
                imageUrl: '/assets/others/baca.webp',
            },
            date: '20-7-2025',
            amount: '$35M',
        },
        {
            id: 4,
            player: {
                id: 1,
                name: 'Mercy',
                imageUrl: '/assets/others/image1.jpg',
            },
            fromClub: {
                id: 1,
                name: 'Bacerlona',
                imageUrl: '/assets/others/madrid.png',
            },
            toClub: {
                id: 1,
                name: 'Real madrid',
                imageUrl: '/assets/others/baca.webp',
            },
            date: '20-7-2025',
            amount: '$35M',
        },
    ];

    const [value, setValue] = useState('1');

    return (
        <div className="flex h-full flex-col rounded-sm bg-gray-200">
            <div className="mb-4 flex items-center justify-between p-3">
                <h1 className="text-lg font-bold text-black">Recent transfers</h1>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                    <div className="rotate-45">
                        <LucideArrowDownUp className="text-lg font-bold text-green-900" />
                    </div>
                </div>
            </div>
            <div className="flex-1">
                {transfers.map((transfer, index) => (
                    <div
                        className={cn('flex items-center justify-between p-2', index != transfers.length - 1 && 'border-b border-gray-300')}
                        key={transfer.id}
                    >
                        <div className="flex items-center gap-x-2">
                            <div className="h-10 w-10 overflow-hidden rounded-full">
                                <img src={transfer.player.imageUrl} alt={transfer.player.name} className="h-full w-full object-cover object-center" />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-xs font-bold">{transfer.player.name}</h3>
                                <div className="flex">
                                    <div className="h-6 w-6 overflow-hidden rounded-full">
                                        <img
                                            src={transfer.fromClub.imageUrl}
                                            alt={transfer.fromClub.name}
                                            className="h-full w-full object-contain object-center"
                                        />
                                    </div>
                                    <ArrowBigRightIcon className="text-lg text-red-500" />
                                    <div className="h-6 w-6 overflow-hidden rounded-full">
                                        <img
                                            src={transfer.toClub.imageUrl}
                                            alt={transfer.toClub.name}
                                            className="h-full w-full rounded-full object-contain object-center"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-bold">{transfer.amount}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-center p-3">
                <Link href="#" className="rounded-sm border border-gray-100 px-2 py-3 text-sm font-bold hover:bg-gray-300">
                    Go to transfer center
                </Link>
            </div>
        </div>
    );
}
