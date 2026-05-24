import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, NewsTypes } from '@/types';
import { Head } from '@inertiajs/react';
import AdForm from './components/ad-form';

export type AdFormProp = {
    types: NewsTypes[];
    ad?: any;
};

export default function Index({ types, ad, ...prop }: AdFormProp) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Ad',
            href: route('ad.index'),
        },
        {
            title: ad ? `Edit ${ad.title}` : 'Create',
            href: route('ad.create'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Ad" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <AdForm types={types} ad={ad} />
            </div>
        </AppLayout>
    );
}
