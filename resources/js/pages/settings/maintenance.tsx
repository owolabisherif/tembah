import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Maintenance',
        href: '/settings/maintenance',
    },
];

type QueueAction = 'none' | 'retry' | 'clear';

type MaintenanceForm = {
    cache: number;
    optimize: number;
    sitemap: number;
    queue: QueueAction;
};

export default function Maintenance() {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, patch, errors, processing, recentlySuccessful, hasErrors } = useForm<Required<MaintenanceForm>>({
        cache: 0,
        optimize: 1,
        sitemap: 0,
        queue: 'none',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('maintenance.update'), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Maintenance" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Maintenance" description="System maintenance" />
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <div className="h-fit w-full rounded-sm bg-green-400 px-1.5 py-2 text-sm text-white">
                            <p>Saved successfully.</p>
                        </div>
                    </Transition>

                    <Transition
                        show={hasErrors}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <div className="h-fit w-full rounded-sm bg-red-500 px-1.5 py-2 text-sm text-white">
                            <p>An error occured.</p>
                        </div>
                    </Transition>

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Reset Cache ?</Label>

                            <Select
                                defaultValue={'no'}
                                onValueChange={(val) => setData('cache', val === 'yes' ? 1 : 0)}
                                value={Boolean(data.cache) ? 'yes' : 'no'}
                                name="cache"
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select one" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="no">No</SelectItem>
                                    <SelectItem value="yes">Yes</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Run Optimization ?</Label>

                            <Select
                                defaultValue={'yes'}
                                onValueChange={(val) => setData('optimize', val === 'yes' ? 1 : 0)}
                                value={Boolean(data.optimize) ? 'yes' : 'no'}
                                name="optimize"
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select one" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="yes">Yes</SelectItem>
                                    <SelectItem value="no">No</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="queue">Queued Jobs Actions</Label>

                            <Select
                                defaultValue={'yes'}
                                onValueChange={(val) => setData('queue', val as QueueAction)}
                                value={data.queue}
                                name="queue"
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select one" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    <SelectItem value="retry">Retry</SelectItem>
                                    <SelectItem value="clear">Clear</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Refresh sitemap ?</Label>

                            <Select
                                defaultValue={'no'}
                                onValueChange={(val) => setData('sitemap', val === 'yes' ? 1 : 0)}
                                value={Boolean(data.sitemap) ? 'yes' : 'no'}
                                name="sitemap"
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select one" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="yes">Yes</SelectItem>
                                    <SelectItem value="no">No</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>Save</Button>
                        </div>
                    </form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
