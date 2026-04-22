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
            href: '#',
        },
        {
            title: 'List',
            href: route('news.transfer.index'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="List" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1>Transfer News</h1>
            </div>
        </AppLayout>
    );
}
