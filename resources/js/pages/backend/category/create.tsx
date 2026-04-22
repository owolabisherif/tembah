import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import CategoryForm from './components/category-form';

export default function Index() {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Category',
            href: '#',
        },
        {
            title: 'Create',
            href: route('category.create'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crate category" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <CategoryForm />
            </div>
        </AppLayout>
    );
}
