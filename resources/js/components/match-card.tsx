import useDateInterpretation from '@/hooks/use-date-interpretation';
import { usePlaceholderImage } from '@/hooks/user-placeholder-image';
import { FixtureMatch } from '@/types/match';
import { Link } from '@inertiajs/react';
import i18next from 'i18next';
import SoccerCard from './soccer-card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

export default function MatchCard({ homeTeam, awayTeam, venueCity, status, timer, date, venue, id, time, sort, isLive, slug }: FixtureMatch) {
    let statusTemp: string[] = ['pen.', 'ft', 'aet', 'ht', 'wo', 'postp.', 'aban.', 'cancl.', 'susp.', 'int.', 'delayed', 'awarded'];

    return (
        <Link
            href={route('soccer.team.matches', { slug: slug })}
            className="mx-0.5 block h-full w-full cursor-pointer overflow-x-hidden rounded-sm border-2 border-gray-100 px-3 py-8 shadow-xs hover:border-blue-100 dark:border-neutral-800"
            dir={i18next.dir()}
        >
            <div className="flex flex-row items-center justify-between">
                <TooltipProvider delayDuration={0}>
                    <Tooltip>
                        <TooltipTrigger>
                            <div className="flex flex-1 cursor-pointer flex-col items-center gap-y-1">
                                <div className="mb-2 flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-gray-100 p-0.5 dark:border-neutral-800">
                                    <img
                                        src={homeTeam.logo ?? usePlaceholderImage()}
                                        alt={homeTeam.name}
                                        className="h-full w-full object-contain object-center"
                                    />
                                </div>
                                <div className="w-20">
                                    <h3 className="line-clamp-1 text-center text-xs font-semibold text-black dark:text-white">
                                        {i18next.language == 'en' ? homeTeam.name : homeTeam.nameAr}
                                    </h3>
                                </div>

                                {/* <div className="flex rounded-full py-0.5">
                                    <h3 className="text-xs font-semibold text-black dark:text-white">{homeTeam.name}</h3>
                                </div> */}
                            </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-blue-950">
                            <p>{i18next.language == 'en' ? homeTeam.name : homeTeam.nameAr}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <div className="relative flex flex-col items-center justify-center gap-y-3">
                    {statusTemp.includes(status.toLowerCase()) ? <SoccerCard homeTeam={homeTeam} awayTeam={awayTeam} /> : ''}

                    {statusTemp.includes(status.toLowerCase()) ? (
                        <div className="relative flex flex-col items-center justify-center whitespace-nowrap">
                            <SoccerCard homeTeam={homeTeam} awayTeam={awayTeam} />
                            <div className="flex items-center gap-x-1 rounded-sm bg-gray-300 p-1 dark:text-black">
                                <img src="/assets/svgs/whistle.svg" alt="" className="w-4" />
                                <p className="text-xs font-black">
                                    {homeTeam.ftScore} - {awayTeam.ftScore}
                                </p>
                            </div>
                            <h4 className="text-xs text-nowrap">
                                {statusTemp.includes(status.toLowerCase()) ? (
                                    <span className="font-bold">{status}</span>
                                ) : (
                                    useDateInterpretation(date)
                                )}
                            </h4>
                        </div>
                    ) : status.toLowerCase().trim() == 'not started' ? (
                        <div className="flex w-24 flex-col items-center justify-center">
                            <div className="flex justify-center gap-x-1 rounded-sm bg-gray-300 px-1.5 py-1 dark:text-black">
                                <img src="/assets/svgs/clock.svg" alt="" className="w-4" />
                                <p className="text-xs font-black whitespace-nowrap">{time}</p>
                            </div>
                            <h4 className="text-xs text-nowrap">{useDateInterpretation(date)}</h4>
                        </div>
                    ) : (
                        <div className="relative flex flex-col items-center justify-center gap-y-2">
                            <div className="relative flex animate-pulse gap-x-1 rounded-sm bg-green-300 p-1">
                                <SoccerCard homeTeam={homeTeam} awayTeam={awayTeam} />
                                {/* <img src="/assets/svgs/whistle.svg" alt="" className="w-4" /> */}
                                <p className="text-xs font-black text-nowrap">
                                    {homeTeam.ftScore} - {awayTeam.ftScore}
                                </p>
                            </div>
                            <h4 className="text-[10px] font-bold text-nowrap">'{timer != '' ? timer : status}</h4>
                        </div>
                    )}
                </div>

                <TooltipProvider delayDuration={0}>
                    <Tooltip>
                        <TooltipTrigger>
                            <div className="flex flex-1 cursor-pointer flex-col items-center gap-y-1 px-1">
                                <div className="mb-2 flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-gray-100 p-0.5 dark:border-neutral-800">
                                    <img
                                        src={awayTeam.logo ?? usePlaceholderImage()}
                                        alt={awayTeam.name}
                                        className="h-full w-full object-contain object-center"
                                    />
                                </div>
                                <div className="w-20">
                                    <h3 className="line-clamp-1 text-center text-xs font-semibold text-black dark:text-white">
                                        <p>{i18next.language == 'en' ? awayTeam.name : awayTeam.nameAr}</p>
                                    </h3>
                                </div>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-blue-950">
                            <p>{i18next.language == 'en' ? awayTeam.name : awayTeam.nameAr}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </Link>
    );
}
