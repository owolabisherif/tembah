import { MatchCardProp } from '@/types/match';

export default function MatchCardBck({ homeTeam, awayTeam, stadium, scores, status, date, leagueName, leagueCountry, venue }: MatchCardProp) {
    return (
        <div className="mx-1 flex flex-col rounded-sm bg-gray-200 p-5 shadow-sm">
            <div className="flex w-full items-center justify-center gap-x-5 text-gray-600">
                <div className="flex items-center justify-center rounded-full bg-blue-950 px-2 py-1 text-white">
                    <p className="text-xs font-bold overflow-ellipsis whitespace-nowrap">{leagueName}</p>
                </div>
                <p>•</p>
                <div className="flex items-center justify-center rounded-full bg-red-500 px-2 py-1 text-white">
                    <p className="text-xs font-bold">{leagueCountry}</p>
                </div>
            </div>
            <div className="mt-5 flex w-full items-center justify-between gap-x-5 text-gray-600">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white px-2 text-white">
                    <div className="h-14 w-14 p-1.5">
                        <img src={homeTeam.imageUrl} alt={homeTeam.name} className="h-full w-full" />
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="flex items-center justify-center rounded-sm bg-gray-300 p-1">
                        <p className="text-xs font-black">{status}</p>
                    </div>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white px-2 text-white">
                    <div className="h-14 w-14 p-1.5">
                        <img src={awayTeam.imageUrl} alt={awayTeam.name} className="h-full w-full object-contain object-center" />
                    </div>
                </div>
            </div>
            <div className="mt-2 flex w-full items-center justify-center gap-x-5 text-black">
                <div>
                    <p className="text-xs font-bold overflow-ellipsis whitespace-nowrap">{homeTeam.name}</p>
                </div>
                <p>•</p>
                <div>
                    <p className="text-xs font-bold">{awayTeam.name}</p>
                </div>
            </div>
            <div className="mt-2 flex w-full items-center justify-center gap-x-5 rounded-sm border border-gray-300 py-1 text-gray-600">
                <div className="h-5 w-5 rotate-45">
                    <img src="/assets/icons/soccer-field2.png" className="h-full w-full" alt="" />
                </div>
                <p className="text-xs font-bold overflow-ellipsis whitespace-nowrap">{venue}</p>
            </div>
        </div>
    );
}
