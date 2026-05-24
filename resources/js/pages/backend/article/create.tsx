import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, CreateNewsProp } from '@/types';
import { Head } from '@inertiajs/react';
import ArticleForm from './components/article-form';

export default function Index({ authors, leagues, teams, players, newsTypes, article, ...props }: CreateNewsProp) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Article',
            href: route('article.index'),
        },
        {
            title: 'Create',
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Article" />
            <div className="overflow-y-hidden p-4">
                <ArticleForm authors={authors} leagues={leagues} teams={teams} players={players} newsTypes={newsTypes} article={article} />
            </div>
        </AppLayout>
    );
}
