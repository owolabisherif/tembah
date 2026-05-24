import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import AuthorForm from './components/author-form';

export type AuthorPropType = {
    author?: any;
};

export default function Index({ author }: AuthorPropType) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Author',
            href: route('author.index'),
        },
        {
            title: author ? `Update ${author.name}` : 'Create',
            href: route('author.create'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create author" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <AuthorForm author={author} />
            </div>
        </AppLayout>
    );
}
