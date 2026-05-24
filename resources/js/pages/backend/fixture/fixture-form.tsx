import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MessageBox from '@/components/ui/message-box';
import { Select as RadSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import useFixtureValidator from '@/validators/use-fixture-validator';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { JsonEditor } from 'json-edit-react';
import { LoaderCircleIcon } from 'lucide-react';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { FixtureType } from '.';

type FixtureFormProp = {
    fixture: FixtureType;
};

export default function FixtureForm({ fixture }: FixtureFormProp) {
    const [processing, setProcessing] = useState<boolean>(false);
    const [editing, setEditing] = useState<boolean>(false);
    const [message, setMessage] = useState<string[]>([]);
    const [messageType, setMessageType] = useState<'error' | 'success' | 'info'>('error');
    const [form, setForm] = useState<FixtureType>({
        id: null,
        slug: '',
        fixture_id: 0,
        static_id: 0,
        league_id: 0,
        home_team_id: 0,
        away_team_id: 0,
        league: '',
        country: '',
        date: '',
        sort: 0,
        meta_title: '',
        meta_title_ar: '',
        meta_desc: '',
        meta_desc_ar: '',
        keywords: '',
        keywords_ar: '',
        _method: 'post',
        match: {},
        by_pass: false,
        created_at: '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Fixtures',
            href: route('fixtures.index'),
        },
        {
            title: `Update ${fixture.slug}`,
            href: '#',
        },
    ];

    const { error, value, errorKeys, messages } = useFixtureValidator(form);

    const resetForm = () => {
        setForm({
            id: null,
            slug: '',
            fixture_id: 0,
            static_id: 0,
            league_id: 0,
            home_team_id: 0,
            away_team_id: 0,
            league: '',
            country: '',
            date: '',
            sort: 0,
            meta_title: '',
            meta_title_ar: '',
            meta_desc: '',
            meta_desc_ar: '',
            keywords: '',
            keywords_ar: '',
            _method: 'post',
            match: {},
            by_pass: false,
            created_at: '',
        });

        window?.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        if (fixture) handleEdit();
    }, [fixture]);

    const handleEdit = async () => {
        setEditing(true);

        setForm((values) => ({
            ...values,
            id: fixture.id,
            slug: fixture.slug,
            fixture_id: fixture.fixture_id,
            static_id: fixture.static_id,
            league_id: fixture.league_id,
            home_team_id: 0,
            away_team_id: 0,
            league: fixture.league,
            country: fixture.country,
            date: fixture.date,
            sort: fixture.sort,
            match: fixture.match,
            meta_title: fixture.seo ? fixture.seo.meta_title : '',
            meta_title_ar: fixture.seo ? fixture.seo.meta_title_ar : '',
            meta_desc: fixture.seo ? fixture.seo.meta_desc : '',
            meta_desc_ar: fixture.seo ? fixture.seo.meta_desc_ar : '',
            keywords: fixture.seo ? fixture.seo.keywords : '',
            keywords_ar: fixture.seo ? fixture.seo.keywords_ar : '',
            _method: 'put',
            by_pass: false,
            created_at: fixture.created_at,
        }));
    };

    const handleChange = (e: ChangeEvent<any>) => {
        const key = e.target.id;
        const value = e.target.value;
        setForm((values) => ({
            ...values,
            [key]: value,
        }));
    };

    const handleCustomChange = (key: string, val: any) => {
        setForm((values) => ({
            ...values,
            [key]: val,
        }));
    };

    const submit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setMessage([]);

        if (error) {
            setMessageType('error');
            setMessage((err) => [...err, error.message]);
            return;
        }

        try {
            setProcessing(true);

            const res = await axios.post(route('fixtures.store'), form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setMessageType('success');
            setMessage((err) => [res.data.message]);

            if (editing) {
                router.get(route('fixtures.index'));
            } else {
                resetForm();
            }
        } catch (error) {
            setMessageType('error');
            setMessage((err) => [...err, (error as any).response.data.message]);
            console.error(error);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Update ${fixture.slug}`} />
            {Boolean(Object.values(message).length) && (
                <MessageBox
                    type={messageType}
                    title={messageType == 'error' ? 'The following error(s) occured:' : null}
                    className="mb-5 px-4"
                    close={() => setMessage([])}
                >
                    <p className="text-xs">
                        {Object.values(message).map((item, i) => item + `${i != Object.values(message).length - 1 ? ', ' : ''}`)}
                    </p>
                </MessageBox>
            )}
            <form className="grid h-full grid-cols-12 gap-x-4 p-4" onSubmit={(e) => submit(e)}>
                <div className="col-span-8 h-full">
                    <div className={cn('border-brand-gray h-full rounded-sm border p-4 shadow-sm')}>
                        <div className="grid grid-cols-12 gap-x-3">
                            <div className="col-span-12 mb-1">
                                <Label htmlFor="static_id">Static ID</Label>
                                <Input
                                    id="static_id"
                                    type="text"
                                    name="static_id"
                                    required
                                    value={form.static_id}
                                    onChange={(e) => handleChange(e)}
                                />
                                {errorKeys.includes('static_id') && <p className="text-xs text-red-500">{messages['static_id']}</p>}
                            </div>

                            <div className="col-span-12 mb-1">
                                <Label htmlFor="fixture_id">Fixture ID</Label>
                                <Input
                                    id="fixture_id"
                                    type="text"
                                    name="fixture_id"
                                    required
                                    value={form.fixture_id}
                                    onChange={(e) => handleChange(e)}
                                />
                                {errorKeys.includes('fixture_id') && <p className="text-xs text-red-500">{messages['fixture_id']}</p>}
                            </div>

                            <div className="col-span-12 mb-1">
                                <Label htmlFor="fixture_id">Sort</Label>
                                <Input id="sort" type="text" name="sort" required value={form.sort} onChange={(e) => handleChange(e)} />
                                {errorKeys.includes('sort') && <p className="text-xs text-red-500">{messages['sort']}</p>}
                            </div>

                            <div className="col-span-12 mb-1">
                                <Label htmlFor="overall_clubs">Match Data</Label>
                                <div className="!w-full">
                                    <JsonEditor
                                        className="h-fit !max-w-full"
                                        data={form.match}
                                        setData={(data) => handleCustomChange('	overall_clubs', data)}
                                    />
                                </div>
                            </div>

                            <div className="col-span-12 mt-10">
                                <div className="flex w-full justify-end">
                                    <Button className="cursor-pointer" disabled={processing}>
                                        {processing && <LoaderCircleIcon className="size-5 animate-spin" />} {editing ? 'UPDATE' : 'SUBMIT'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-4 h-full">
                    <div className="border-brand-gray h-full rounded-sm border p-3 shadow-sm">
                        <div className="mb-5">
                            <h3 className="font-bold">Player settings</h3>
                        </div>

                        <div className="col-span-12">
                            <div className="col-span-12 mb-1">
                                <div className="col-span-12 mb-1">
                                    <Label htmlFor="by_pass">Bypass API Update ?</Label>
                                    <RadSelect
                                        defaultValue={'yes'}
                                        onValueChange={(val) => handleCustomChange('by_pass', val === 'yes' ? true : false)}
                                        value={form.by_pass ? 'yes' : 'no'}
                                        name="by_pass"
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select one" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="yes">Yes</SelectItem>
                                            <SelectItem value="no">No</SelectItem>
                                        </SelectContent>
                                    </RadSelect>
                                </div>
                            </div>
                        </div>

                        <h3 className="my-5 font-bold">SEO (optional)</h3>
                        <div className="col-span-12 mb-1">
                            <Label htmlFor="meta_title">Meta title</Label>
                            <Input
                                id="meta_title"
                                type="text"
                                name="meta_title"
                                placeholder="Enter meta title"
                                value={form.meta_title ?? ''}
                                onChange={(e) => handleChange(e)}
                            />
                        </div>
                        <div className="col-span-12 mb-1">
                            <Label htmlFor="meta_title_ar">Meta title (Arabic)</Label>
                            <Input
                                id="meta_title_ar"
                                type="text"
                                name="meta_title_ar"
                                placeholder="Enter meta title (arabic)"
                                value={form.meta_title_ar ?? ''}
                                onChange={(e) => handleChange(e)}
                            />
                        </div>
                        <div className="col-span-12 mb-1">
                            <Label htmlFor="meta_desc">Meta description</Label>
                            <textarea
                                id="meta_desc"
                                name="meta_desc"
                                placeholder="Enter meta description"
                                className="block w-full resize-none rounded-sm border border-input p-2 shadow-sm placeholder:text-xs focus:outline-0"
                                value={form.meta_desc ?? ''}
                                onChange={(e) => handleChange(e)}
                            />
                        </div>

                        <div className="col-span-12 mb-1">
                            <Label htmlFor="meta_desc_ar">Meta description (Arabic)</Label>
                            <textarea
                                id="meta_desc_ar"
                                name="meta_desc_ar"
                                placeholder="Enter meta description (arabic)"
                                className="block w-full resize-none rounded-sm border border-input p-2 shadow-sm placeholder:text-xs focus:outline-0"
                                value={form.meta_desc_ar ?? ''}
                                onChange={(e) => handleChange(e)}
                            />
                        </div>

                        <div className="col-span-12 mb-1">
                            <Label htmlFor="keywords">Keywords</Label>
                            <Input
                                id="keywords"
                                type="text"
                                name="keywords"
                                placeholder="Enter keywords"
                                value={form.keywords ?? ''}
                                onChange={(e) => handleChange(e)}
                            />
                            {errorKeys.includes('keywords') && <p className="text-xs text-red-500">{messages['keywords']}</p>}
                        </div>

                        <div className="col-span-12 mb-10">
                            <Label htmlFor="keywords_ar">Keywords (Arabic)</Label>
                            <Input
                                id="keywords_ar"
                                type="text"
                                name="keywords_ar"
                                dir="rtl"
                                placeholder="Enter keywords (arabic)"
                                value={form.keywords_ar ?? ''}
                                onChange={(e) => handleChange(e)}
                            />
                            {errorKeys.includes('keywords_ar') && <p className="text-xs text-red-500">{messages['keywords_ar']}</p>}
                        </div>
                    </div>
                </div>
            </form>
        </AppLayout>
    );
}
