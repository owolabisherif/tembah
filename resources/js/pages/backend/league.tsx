import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

export default function Index() {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'League',
            href: route('league.index'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Countries" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1>League</h1>
            </div>
        </AppLayout>
    );
}
