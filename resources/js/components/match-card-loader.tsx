import { usePlaceholderImage } from '@/hooks/user-placeholder-image';
import { MoreVerticalIcon } from 'lucide-react';

type MatchCardType = 'news' | 'match';

type MatchCardProp = {
    type?: MatchCardType;
};

export default function MatchCardLoader({ type = 'match' }: MatchCardProp) {
    return type == 'match' ? (
        <div className="relative mx-0.5 h-full w-full overflow-x-hidden rounded-sm border-2 border-gray-100 px-3 py-8 shadow-xs">
            <div className="anim absolute inset-0 bg-gray-500/30 backdrop-blur-sm"></div>
            <div className="absolute inset-0 animate-pulse bg-white/70"></div>
            <div className="flex flex-row items-center justify-between">
                <div className="flex flex-1 flex-col items-center gap-y-1 px-1">
                    <div className="mb-2 h-9 w-9 overflow-hidden rounded-full border border-gray-100">
                        <img src={usePlaceholderImage()} alt="Team A" className="h-full w-full object-contain object-center" />
                    </div>

                    <h3 className="text-center text-xs font-semibold text-black">Team B</h3>
                </div>

                <div className="flex flex-col items-center justify-center gap-y-3">
                    <div className="flex flex-col items-center justify-center">
                        <div className="flex gap-x-1 rounded-sm bg-gray-300 p-1">
                            <img src="/assets/svgs/whistle.svg" alt="" className="w-4" />
                            <p className="text-xs font-black">0 - 0</p>
                        </div>
                        <h4 className="text-xs text-nowrap">XX-XX-XXXX</h4>
                    </div>
                </div>

                <div className="flex flex-1 flex-col items-center gap-y-1 px-1">
                    <div className="mb-2 h-9 w-9 overflow-hidden rounded-full border border-gray-100">
                        <img src={usePlaceholderImage()} alt="Team B" className="h-full w-full object-contain object-center" />
                    </div>

                    <h3 className="text-center text-xs font-semibold text-black">Team B</h3>
                </div>
            </div>
        </div>
    ) : (
        <div className="flex w-full animate-pulse flex-col gap-x-3">
            <div className="mb-1 h-32 w-full overflow-hidden rounded-sm bg-gray-200"></div>
            <div className="flex h-24 flex-1 flex-col overflow-hidden">
                <div className="mb-3 h-2 w-full rounded-full bg-gray-100"></div>
                <div className="mb-2 flex justify-between">
                    <div className="flex h-fit w-full flex-1 items-center gap-x-1">
                        <div className="h-8 w-8 rounded-full bg-gray-100"></div>
                        <p className="text-xs text-gray-100">Tembah • 1 hour ago</p>
                    </div>
                    <div className="h-2 rounded-full">
                        <MoreVerticalIcon className="w-4 text-gray-100" />
                    </div>
                </div>
            </div>
        </div>
    );
}
