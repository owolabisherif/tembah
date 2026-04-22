import { cn } from '@/lib/utils';
import { FixtureTeam } from '@/types/match';
import RedCard from './svgs/red-card';

type SoccerCardProp = {
    homeTeam: FixtureTeam;
    awayTeam: FixtureTeam;
};

export default function SoccerCard({ homeTeam, awayTeam }: SoccerCardProp) {
    return (
        <>
            {awayTeam.hasRed || awayTeam.hasYellow || awayTeam.hasYellowRed ? (
                <RedCard
                    className={cn(
                        'absolute -top-1 right-1 -z-10 h-2 w-1.5 rounded-xs bg-red-600 shadow-sm',
                        awayTeam.hasRed
                            ? 'bg-red-600 shadow-sm'
                            : awayTeam.hasYellow
                              ? 'bg-yellow-500'
                              : 'bg-gradient-to-r from-yellow-500 to-red-600',
                    )}
                />
            ) : (
                ''
            )}

            {homeTeam.hasRed || homeTeam.hasYellow || homeTeam.hasYellowRed ? (
                <RedCard
                    className={cn(
                        'absolute -top-1 left-1 -z-10 h-2 w-1.5 rounded-xs',
                        homeTeam.hasRed
                            ? 'bg-red-600 shadow-sm'
                            : homeTeam.hasYellow
                              ? 'bg-yellow-500'
                              : 'bg-gradient-to-r from-yellow-500 to-red-600',
                    )}
                />
            ) : (
                ''
            )}
        </>
    );
}
