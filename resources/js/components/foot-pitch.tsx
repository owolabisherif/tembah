import { usePlaceholderImage } from '@/hooks/user-placeholder-image';
import { cn } from '@/lib/utils';
import { Fixture, FormationType, MatchOverviewTeam } from '@/types/match';
import { Link } from '@inertiajs/react';

type FootPitchProp = {
    fixture: Fixture;
    homeTeam: MatchOverviewTeam;
    awayTeam: MatchOverviewTeam;
    formation: FormationType[];
    isPrediction?: boolean;
};

const checkTextColorOverlap = (bgColor: string, textColor: string) => {
    if (bgColor == textColor) return '000000';

    return textColor;
};

export default function FootPitch({ fixture, homeTeam, awayTeam, formation, isPrediction = false }: FootPitchProp) {
    return (
        <>
            <div className="flex h-fit w-full items-center justify-between border-b border-b-gray-100 p-3">
                <div className="flex items-center gap-x-5">
                    <div className="flex items-center gap-x-2">
                        <div className="h-8 w-8 overflow-hidden rounded-full border border-gray-100">
                            <img
                                src={fixture.match.homeTeam.logo ?? usePlaceholderImage()}
                                alt={fixture.match.homeTeam.name}
                                className="h-full w-full object-contain object-center"
                            />
                        </div>
                        <h3 className="text-md line-clamp-1 text-center font-semibold whitespace-normal text-black">{fixture.match.homeTeam.name}</h3>
                    </div>
                    <div className="juce flex items-center rounded-md bg-[#2aad50] px-1.5 py-0.5 text-white">
                        <p className="text-xs font-bold">{homeTeam.lineup.formation}</p>
                    </div>
                </div>

                {isPrediction && (
                    <div>
                        <h3 className="font-bold">Predicted lineups</h3>
                    </div>
                )}

                <div className="flex items-center gap-x-5">
                    <div className="flex items-center gap-x-2">
                        <div className="h-8 w-8 overflow-hidden rounded-full border border-gray-100">
                            <img
                                src={fixture.match.awayTeam.logo ?? usePlaceholderImage()}
                                alt={fixture.match.awayTeam.name}
                                className="h-full w-full object-contain object-center"
                            />
                        </div>
                        <h3 className="text-md line-clamp-1 text-center font-semibold whitespace-normal text-black">{fixture.match.awayTeam.name}</h3>
                    </div>
                    <div className="juce flex items-center rounded-md bg-[#2aad50] px-1.5 py-0.5 text-white">
                        <p className="text-xs font-bold">{awayTeam.lineup.formation}</p>
                    </div>
                </div>
            </div>

            <div className="flex h-[35rem] w-full items-center justify-center bg-[#2aad50] bg-cover">
                <div
                    className="h-full w-[900px]"
                    style={{
                        backgroundImage: "url('/assets/svgs/pitch2.svg')",
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'cover',
                    }}
                >
                    <div className="relative h-full w-full">
                        {formation.map((player) => (
                            <div
                                key={player.id}
                                className={cn(`player ${player.team}`)}
                                style={{
                                    left: `${player.x}%`,
                                    top: `${player.y}%`,
                                }}
                            >
                                {player.player.image ? (
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200">
                                        <img className="h-full w-full rounded-full object-cover" src={player.player.image ?? usePlaceholderImage()} />
                                    </div>
                                ) : (
                                    <div
                                        className="flex h-8 w-8 items-center justify-center rounded-full text-xs"
                                        style={{
                                            backgroundColor: player.isGoalKeeper
                                                ? `${player.team == 'home' ? '#' + homeTeam.colors.goalKeeper.primary : '#' + awayTeam.colors.goalKeeper.primary}`
                                                : `${player.team == 'home' ? '#' + homeTeam.colors.player.primary : '#' + awayTeam.colors.player.primary}`,
                                            color: player.isGoalKeeper
                                                ? `${player.team == 'home' ? '#' + checkTextColorOverlap(homeTeam.colors.goalKeeper.primary, homeTeam.colors.goalKeeper.number) : '#' + checkTextColorOverlap(awayTeam.colors.goalKeeper.primary, awayTeam.colors.goalKeeper.number)}`
                                                : `${player.team == 'home' ? '#' + checkTextColorOverlap(homeTeam.colors.player.primary, homeTeam.colors.player.number) : '#' + checkTextColorOverlap(awayTeam.colors.player.primary, awayTeam.colors.player.number)}`,
                                            borderColor: player.isGoalKeeper
                                                ? `${player.team == 'home' ? '#' + homeTeam.colors.goalKeeper.border : '#' + awayTeam.colors.goalKeeper.border}`
                                                : `${player.team == 'home' ? '#' + homeTeam.colors.player.border : '#' + awayTeam.colors.player.border}`,
                                        }}
                                    >
                                        {player.player?.number}
                                    </div>
                                )}

                                <div className="flex gap-x-1 text-center">
                                    {player.isCaptain && (
                                        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-black text-xs text-white">
                                            <p>C</p>
                                        </div>
                                    )}
                                    <Link
                                        href={route('show.player', {
                                            slug: player.player.slug,
                                            shirt: player.player.number,
                                            player: player.player.id,
                                        })}
                                        className="mb-1 block max-w-10 hover:underline"
                                    >
                                        {player.player.image ? (
                                            <p className="flex-1 text-[10px] font-bold">
                                                <span className="text-gray-700">{player.player?.number}</span> {player.player?.name}
                                            </p>
                                        ) : (
                                            <p className="flex-1 text-[10px] font-bold">{player.player?.name}</p>
                                        )}
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex h-fit w-full justify-between border-b border-b-gray-100 p-3">
                <div className="flex items-center gap-x-2">
                    <div className="h-7 w-7 overflow-hidden rounded-full border border-gray-100">
                        <img src={usePlaceholderImage()} alt={'coach1'} className="h-full w-full object-contain object-center" />
                    </div>
                    <h3 className="text-md line-clamp-1 text-center font-semibold whitespace-normal text-black">-</h3>
                </div>

                <h3 className="font-bold">Coach</h3>
                <div className="flex items-center gap-x-2">
                    <div className="h-7 w-7 overflow-hidden rounded-full border border-gray-100">
                        <img src={usePlaceholderImage()} alt={'coach2'} className="h-full w-full object-contain object-center" />
                    </div>
                    <h3 className="text-md line-clamp-1 text-center font-semibold whitespace-normal text-black">-</h3>
                </div>
            </div>
        </>
    );
}
