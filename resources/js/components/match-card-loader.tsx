import { usePlaceholderImage } from '@/hooks/user-placeholder-image';

export default function MatchCardLoader() {
    return (
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
    );
}
