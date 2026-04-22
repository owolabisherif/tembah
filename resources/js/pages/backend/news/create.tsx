import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, CreateNewsProp } from '@/types';
import { Head } from '@inertiajs/react';
import NewsForm from './components/news-form';

export default function Index({ newsTypes, authors, leagues, teams, news, ...props }: CreateNewsProp) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'News',
            href: route('news.index'),
        },
        {
            title: 'Create',
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${news ? 'Edit' : 'Create'} news`} />
            <div className="overflow-y-hidden p-4">
                <NewsForm newsTypes={newsTypes} authors={authors} leagues={leagues} teams={teams} news={news} />
            </div>
        </AppLayout>
    );
}
