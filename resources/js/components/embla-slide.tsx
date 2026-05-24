import useDateInterpretation from '@/hooks/use-date-interpretation';
import { usePlaceholderImage } from '@/hooks/user-placeholder-image';
import { cn } from '@/lib/utils';
import { FixtureMatch } from '@/types/match';
import i18next from 'i18next';

const getStatBg = (status: string): string => {
    if (status.toLocaleLowerCase() == 'ht') return 'bg-green-500 text-white animate-pulse';
    if (status.toLocaleLowerCase() == 'ft') return 'bg-gray-200';
    if (status.toLocaleLowerCase() == 'pen') return 'bg-yellow-200 animate-pulse';

    return 'bg-tranparent';
};

export default function EmblaSlide({ matches, ...props }: { matches: FixtureMatch[][][] }) {
    return (
        <>
            {matches.length &&
                matches.map((games, index) => (
                    <div className="embla__slide px-0 md:px-10" key={index}>
                        {/* <div className="mb-3 flex items-center justify-center">
                            <div className="flex w-fit items-center justify-center gap-x-2 rounded-sm bg-gray-500 px-2 py-1 text-sm font-bold text-white">
                                <Calendar1Icon className="size-4" />
                                <p>{useDateInterpretation(games[0][0].date)}</p>
                                <p> - </p>
                                <p>{useDateInterpretation(games[games.length - 1][0].date)}</p>
                            </div>
                        </div> */}

                        {games.map((pages, idx) => (
                            <div key={idx} className="" dir={i18next.dir()}>
                                <div className="mb-5">
                                    <div className="rounded-sm bg-blue-950 px-2 py-2 text-white shadow-sm">
                                        <p className="text-sm font-bold">{useDateInterpretation(games[idx][0].date)}</p>
                                    </div>
                                </div>
                                {pages.map((item) => (
                                    <a
                                        href={`${item.homeTeam.slug}-vs-${item.awayTeam.slug}`}
                                        className="mb-3 flex items-center gap-x-5"
                                        key={`${item.homeTeam.slug}-vs-${item.awayTeam.slug}`}
                                    >
                                        <div
                                            className={cn(
                                                'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold',
                                                getStatBg(item.status),
                                            )}
                                        >
                                            {item.status.toLocaleLowerCase() != 'not started' ? item.status : ''}
                                        </div>
                                        <div className="flex flex-1 items-center justify-end gap-x-1">
                                            <h3 className="line-clamp-1 text-center text-xs font-semibold whitespace-normal text-black">
                                                {i18next.language == 'en' ? item.homeTeam.name : item.homeTeam.nameAr}
                                            </h3>
                                            <div className="h-7 w-7 shrink-0 overflow-hidden rounded-full border border-gray-100">
                                                <img
                                                    src={item.homeTeam.logo ?? usePlaceholderImage()}
                                                    alt={item.homeTeam.name}
                                                    className="h-full w-full object-contain object-center"
                                                />
                                            </div>
                                        </div>
                                        <div className="w-20 md:w-fit">
                                            {item.status.toLowerCase() == 'ft' ||
                                            item.status.toLowerCase().includes('pen') ||
                                            item.status.toLowerCase().includes('aet') ? (
                                                <div className="flex flex-col items-center justify-center gap-y-2">
                                                    <div className="flex gap-x-1 rounded-sm bg-gray-300 p-1">
                                                        <img src="/assets/svgs/whistle.svg" alt="" className="w-4" />
                                                        <p className="text-xs font-black">
                                                            {item.homeTeam.ftScore} - {item.awayTeam.ftScore}
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : item.status.toLowerCase().trim() == 'not started' ? (
                                                <div className="flex flex-col items-center justify-center gap-y-2">
                                                    <div className="flex gap-x-1 rounded-sm bg-gray-300 p-1 whitespace-nowrap">
                                                        <img src="/assets/svgs/clock.svg" alt="" className="w-4" />
                                                        <p className="text-xs font-black">{item.time}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center gap-y-2">
                                                    <div className="flex gap-x-1 rounded-sm bg-gray-300 p-1">
                                                        <img src="/assets/svgs/clock.svg" alt="" className="w-4" />
                                                        <p className="text-xs font-black">{item.status}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex w-full flex-1 items-center justify-start gap-x-1">
                                            <div className="h-7 w-7 overflow-hidden rounded-full border border-gray-100">
                                                <img
                                                    src={item.awayTeam.logo ?? usePlaceholderImage()}
                                                    alt={item.awayTeam.name}
                                                    className="h-full w-full object-contain object-center"
                                                />
                                            </div>

                                            <h3 className="line-clamp-1 text-center text-xs font-semibold whitespace-normal text-black">
                                                {i18next.language == 'en' ? item.awayTeam.name : item.awayTeam.nameAr}
                                            </h3>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        ))}
                    </div>
                ))}
        </>
    );
}
