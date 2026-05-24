import Loader from '@/components/loader';
import { usePlaceholderImage } from '@/hooks/user-placeholder-image';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import axios from 'axios';
import i18next from 'i18next';
import { useEffect, useState } from 'react';
import Ad from '../ad';

type HeadToHeadProp = {
    slug: string;
};

type BiggestType = {
    awayScore: string;
    category: string;
    date: string;
    homeScore: string;
    leagueId: string;
    staticId: number;
};

type GoalType = {
    awayConceded: number;
    awayScore: number;
    homeConceded: number;
    homeScore: number;
};

type last5Type = {};

type TeamType = {
    id: number;
    imageUrl: string;
    biggestDefeat: BiggestType;
    biggestVictory: BiggestType;
    goals: GoalType;
    overall: {
        draws: number;
        goals: number;
        lost: number;
        won: number;
    };
};

interface HeadToHeadType {
    homeTeam: TeamType;
    awayTeam: TeamType;
    top50s: {
        slug: string;
        country: string;
        leagueId: number;
        league: string;
        leagueAr: string;
        staticId: number;
        date: string;
        homeTeam: {
            id: number;
            name: string;
            nameAr: string;
            score: number;
        };
        awayTeam: {
            id: number;
            name: string;
            nameAr: string;
            score: number;
        };
    }[];
}

export default function HeadToHead({ slug }: HeadToHeadProp) {
    const [h2h, setH2H] = useState<HeadToHeadType>();

    useEffect(() => {
        getH2H();
    }, []);

    const getH2H = async () => {
        const res = await axios.get<HeadToHeadType>(route('soccer.show.team.h2h', { slug }));

        console.log(res.data);

        setH2H(res.data);
    };

    return (
        <>
            <Ad />

            <div className="rounded-sm bg-white p-3 shadow-sm">
                {h2h && Boolean(Object.entries(h2h).length) ? (
                    <>
                        {}
                        <div className="flex w-full items-center justify-center gap-x-10">
                            <div className="h-8 w-8 overflow-hidden rounded-full border border-gray-100">
                                <img
                                    src={h2h.homeTeam?.imageUrl ?? usePlaceholderImage()}
                                    alt={h2h.homeTeam.id.toString()}
                                    className="h-full w-full object-contain object-center"
                                />
                            </div>
                            <div className="rounded-2xl bg-blue-800 px-5 py-2 font-bold text-white">{h2h?.homeTeam.overall.won}</div>
                            <div className="rounded-2xl bg-blue-800 px-5 py-2 font-bold text-white">{h2h?.awayTeam.overall.draws}</div>
                            <div className="rounded-2xl bg-blue-800 px-5 py-2 font-bold text-white">{h2h?.awayTeam.overall.won}</div>
                            <div className="h-8 w-8 overflow-hidden rounded-full border border-gray-100">
                                <img
                                    src={h2h.awayTeam?.imageUrl ?? usePlaceholderImage()}
                                    alt={h2h.awayTeam.id.toString()}
                                    className="h-full w-full object-contain object-center"
                                />
                            </div>
                        </div>
                        <div className="mt-5 w-full overflow-x-auto">
                            <table className="table w-full table-auto transition-all">
                                <tbody>
                                    {h2h?.top50s.map((item, index) => (
                                        <tr className={cn('mb-1 w-full cursor-pointer hover:bg-gray-200')} key={index}>
                                            <td className="w-full border-b border-gray-50 py-1.5 pl-5 text-xs">
                                                <Link
                                                    href={route('soccer.team.matches', { slug: item.slug })}
                                                    className="flex items-center gap-x-5 px-4 py-3"
                                                    key={item.slug}
                                                >
                                                    <div className="w-full">
                                                        <div className="mb-2 flex w-full justify-between">
                                                            <p className="text-gray-400">{item.date}</p>
                                                            <p className="text-gray-400">{i18next.language == 'en' ? item.league : item.leagueAr}</p>
                                                        </div>
                                                        <div className="flex w-full items-center justify-center gap-x-5">
                                                            <div className="flex flex-1 items-center justify-end gap-x-3">
                                                                <h3 className="line-clamp-1 text-center text-xs font-semibold whitespace-normal text-black">
                                                                    {i18next.language == 'en' ? item.homeTeam.name : item.homeTeam.nameAr}
                                                                </h3>
                                                                <div className="h-5 w-5 overflow-hidden rounded-full border border-gray-100">
                                                                    <img
                                                                        src={h2h.homeTeam?.imageUrl ?? usePlaceholderImage()}
                                                                        alt={item.homeTeam.name}
                                                                        className="h-full w-full object-contain object-center"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="flex font-bold">
                                                                <p>{item.homeTeam.score}</p>
                                                                <p> - </p>
                                                                <p>{item.awayTeam.score}</p>
                                                            </div>
                                                            <div className="flex flex-1 items-center gap-x-3">
                                                                <div className="h-5 w-5 overflow-hidden rounded-full border border-gray-100">
                                                                    <img
                                                                        src={h2h.awayTeam?.imageUrl ?? usePlaceholderImage()}
                                                                        alt={item.awayTeam.name}
                                                                        className="h-full w-full object-contain object-center"
                                                                    />
                                                                </div>
                                                                <h3 className="line-clamp-1 text-center text-xs font-semibold whitespace-normal text-black">
                                                                    {i18next.language == 'en' ? item.awayTeam.name : item.awayTeam.nameAr}
                                                                </h3>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <Loader />
                )}
            </div>
        </>
    );
}
