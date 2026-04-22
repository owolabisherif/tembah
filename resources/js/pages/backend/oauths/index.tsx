import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { FacebookIcon } from 'lucide-react';

export default function Index() {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'OAuth',
            href: route('oauth.index'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Oauths" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h3>This page handles Authentication for social post within the app.</h3>
                <div className="grid grid-cols-12">
                    <a
                        className="col-span-4 flex h-28 items-center justify-center gap-x-2 rounded-md shadow-md hover:shadow-lg"
                        href={route('oauth.facebook')}
                    >
                        <p>Authenticate with facebook</p>

                        <FacebookIcon />
                    </a>
                </div>
            </div>
        </AppLayout>
    );
}
