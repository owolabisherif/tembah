import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import NewsletterForm from './components/newsletter-form';

export default function Create() {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Newsletter',
            href: route('newsletter.index'),
        },
        {
            title: 'Mails',
            href: route('newsletter.index'),
        },
        {
            title: 'Create',
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Create newsletter`} />
            <div className="overflow-y-hidden p-4">
                <NewsletterForm />
            </div>
        </AppLayout>
    );
}
