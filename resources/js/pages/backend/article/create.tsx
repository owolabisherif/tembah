import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, CreateNewsProp } from '@/types';
import { Head } from '@inertiajs/react';
import ArticleForm from './components/article-form';

export default function Index({ authors, leagues, teams, players, newsTypes, ...props }: CreateNewsProp) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Article',
            href: '#',
        },
        {
            title: 'Create',
            href: route('article.create'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Article" />
            <div className="overflow-y-hidden p-4">
                <ArticleForm authors={authors} leagues={leagues} teams={teams} players={players} newsTypes={newsTypes} />
            </div>
        </AppLayout>
    );
}
