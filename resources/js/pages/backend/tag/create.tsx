import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import TagForm from './components/tag-form';

export type TagPropType = {
    tag?: any;
};

export default function Index({ tag }: TagPropType) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Tag',
            href: route('tag.index'),
        },
        {
            title: tag ? `Update ${tag.title}` : 'Create',
            href: route('tag.create'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create tag" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <TagForm tag={tag} />
            </div>
        </AppLayout>
    );
}
