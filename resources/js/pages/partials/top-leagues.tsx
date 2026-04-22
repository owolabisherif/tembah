import { League } from '@/types/match';
import { Link } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function TopLeagues() {
    const placeholderImage = '/assets/images/logo2.png';
    const [leagues, setLeagues] = useState<League[]>([]);

    useEffect(() => {
        handleGetTopLeagues();
    }, []);

    const handleGetTopLeagues = async () => {
        const res = await axios.get(route('top.leagues'));

        setLeagues(res.data);
    };

    return (
        <div className="!scrollbar overflow-y-auto rounded-sm">
            <div className="mb-4">
                <h1 className="text-lg font-bold text-black">Important Tournaments</h1>
            </div>
            <div className="scrollbar flex flex-col">
                {leagues.map((league) => (
                    <Link
                        className="mb-2 flex items-center justify-between gap-x-3 rounded-sm p-1 hover:bg-gray-400 hover:text-white"
                        key={league.id}
                        href={route('index.league', { slug: league.slug })}
                    >
                        <div className="h-7 w-7 rounded-full border border-gray-200">
                            <img
                                className="h-full w-full rounded-full object-fill"
                                src={league.logo.split('.')[0] != `${league.leagueId}` ? league.logo : placeholderImage}
                                alt={league.name}
                            />
                        </div>
                        <p className="flex-1 text-sm font-semibold capitalize select-none">{league.name}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
