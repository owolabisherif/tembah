import GuestLayout from '@/layouts/guest-layout';
import { t } from 'i18next';
import AllLeagues from '../partials/all-leagues';
import TopLeagues from '../partials/top-leagues';
import TopLeaguesStanding from '../partials/top-leagues-standing';

export default function Leagues() {
    return (
        <GuestLayout title={t('Leagues')}>
            <div className="flex h-full w-full flex-col">
                <TopLeagues />
                <TopLeaguesStanding />
                <AllLeagues />
            </div>
        </GuestLayout>
    );
}
