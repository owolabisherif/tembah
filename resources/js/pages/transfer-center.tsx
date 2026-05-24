import GuestLayout from '@/layouts/guest-layout';

type TransferCenterProp = {
    topLeagues: any;
    teams: any;
};

export default function TransferCenter() {
    return (
        <GuestLayout>
            <div className="flex h-screen w-full items-center justify-center rounded-sm">
                <h3 className="font-bold text-black">Coming Soon.... please check back.</h3>
            </div>
        </GuestLayout>
    );
}
