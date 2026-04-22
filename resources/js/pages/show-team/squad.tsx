import useNumberFormatter from '@/hooks/use-number-formatter';
import { usePlaceholderImage } from '@/hooks/user-placeholder-image';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import { ShowTeamProp } from '.';
import Ad from '../partials/ad';

export default function Squad({ team, league, ...props }: PropsWithChildren<ShowTeamProp>) {
    return (
        <>
            <Ad />
            {team && team.coach ? (
                <div className="my-5 rounded-md p-3 shadow-md">
                    <h3 className="mb-2 font-bold">Coach</h3>
                    <div className="flex w-full items-center gap-x-3">
                        <div className="h-8 w-8 overflow-hidden rounded-full border border-gray-200">
                            <img
                                src={team.coach.image ? team.coach.image : usePlaceholderImage()}
                                alt={team.coach.name}
                                className="h-full w-full object-contain"
                            />
                        </div>
                        <div className="flex flex-1 flex-col justify-start">
                            <p className="">{team.coach.name}</p>
                        </div>
                    </div>
                </div>
            ) : (
                ''
            )}
            <div className="rounded-md shadow-md">
                {team && team.squad.length ? (
                    <table className="mt-5 table w-full table-auto transition-all">
                        <thead>
                            <tr>
                                <th className="py-3 pl-3 text-left text-xs">#</th>
                                <th className="py-3 text-left text-xs">Player</th>
                                <th className="py-3 text-left text-xs">Position</th>
                                <th className="py-3 text-left text-xs">Nationality</th>
                                <th className="py-3 text-left text-xs">Age</th>
                                <th className="py-3 text-left text-xs">Shirt</th>
                                <th className="py-3 text-left text-xs">Height</th>
                                <th className="py-3 text-left text-xs">Transfer value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {team.squad.map((item, index) => (
                                <tr className={cn('w-full cursor-pointer hover:bg-gray-200')} key={`${item.id}-${index}`}>
                                    <td className="border-b border-gray-100 py-3 pl-3 text-xs font-bold">{index + 1}</td>
                                    <td className="border-b border-gray-100 py-3 text-xs font-bold whitespace-nowrap">
                                        <div className="flex w-full items-center gap-x-3">
                                            <div className="h-8 w-8 overflow-hidden rounded-full border border-gray-200">
                                                <img
                                                    src={item.image ? item.image : usePlaceholderImage()}
                                                    alt={item.name}
                                                    className="h-full w-full object-contain"
                                                />
                                            </div>
                                            <div className="flex flex-1 flex-col justify-start">
                                                <Link
                                                    href={route('show.player', {
                                                        slug: item.slug,
                                                        shirt: item.shirt,
                                                        player: item.id,
                                                    })}
                                                    className="mb-1 hover:underline"
                                                >
                                                    {item.name}
                                                </Link>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="border-b border-gray-100 py-3 text-xs font-bold">{item.position ?? '-'}</td>
                                    <td className="border-b border-gray-100 py-3 text-xs font-bold">
                                        {item.nationality ? (
                                            <div className="flex items-center gap-x-1">
                                                <div className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-200">
                                                    <img
                                                        className="h-full w-full rounded-full object-cover"
                                                        src={item.countryFlag ?? usePlaceholderImage()}
                                                    />
                                                </div>
                                                <p className="flex-1">{item.nationality}</p>
                                            </div>
                                        ) : (
                                            '-'
                                        )}
                                    </td>
                                    <td className="border-b border-gray-100 py-3 text-xs font-bold">{item.age ?? '-'}</td>
                                    <td className="border-b border-gray-100 py-3 text-xs font-bold">{item.shirt ?? '-'}</td>
                                    <td className="border-b border-gray-100 py-3 text-xs font-bold">{item.height ?? '-'}</td>
                                    <td className="border-b border-gray-100 py-3 text-xs font-bold">
                                        {item.transferValue ? useNumberFormatter(+item.transferValue) : '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <>
                        <div className="flex w-full items-center justify-center p-3">
                            <p className="text-lg font-bold">Nothing here to show. Please check back.</p>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
