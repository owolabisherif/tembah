import { League } from '@/types/match';
import { Link } from '@inertiajs/react';
import axios from 'axios';
import i18next, { t } from 'i18next';
import { useEffect, useState } from 'react';

export default function TopLeagues() {
    const placeholderImage = '/assets/images/logo2.png';
    const [leagues, setLeagues] = useState<League[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        handleGetTopLeagues();
    }, []);

    const handleGetTopLeagues = async () => {
        try {
            setLoading(true);

            const res = await axios.get(route('top.leagues'));

            setLeagues(res.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {!loading && leagues.length ? (
                <div className="!scrollbar mb-5 rounded-sm sm:h-fit md:mb-0 md:overflow-y-auto">
                    <div className="mb-4">
                        <h3 className="text-lg font-bold text-black">{t('Top Leagues')}</h3>
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
                                <p className="flex-1 text-sm font-semibold capitalize select-none">
                                    {i18next.language == 'en' ? league.name : league.nameAr}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            ) : loading ? (
                <div className="h-full w-full animate-pulse rounded-sm bg-gray-200"></div>
            ) : (
                <></>
            )}
        </>
    );
}
