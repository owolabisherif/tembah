import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

export default function Index() {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'News',
            href: route('news.index'),
        },
        {
            title: 'Transfer',
            href: route('news.transfer.index'),
        },
        {
            title: 'Stats',
            href: route('news.transfer.stats'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transfer Stats" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1>Transfer Stats</h1>
            </div>
        </AppLayout>
    );
}
