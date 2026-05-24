import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import CategoryForm from './components/category-form';

export type CategoryPropType = {
    category?: any;
};

export default function Index({ category }: CategoryPropType) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Category',
            href: route('category.index'),
        },
        {
            title: category ? `Update ${category.title}` : 'Create',
            href: route('category.create'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create category" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <CategoryForm category={category} />
            </div>
        </AppLayout>
    );
}
