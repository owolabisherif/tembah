import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, CreateNewsProp } from '@/types';
import { Head } from '@inertiajs/react';
import TransferNewsForm from '../components/transfer-news-form';

export default function Index({ newsTypes, authors, leagues, teams, players, ...props }: CreateNewsProp) {
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
            title: 'Create',
            href: route('news.transfer.create'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create transfer news" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <TransferNewsForm newsTypes={newsTypes} authors={authors} leagues={leagues} teams={teams} players={players} />
            </div>
        </AppLayout>
    );
}
