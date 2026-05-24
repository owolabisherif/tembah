import { Button } from '@/components/ui/button';
import DropZone from '@/components/ui/dropzone';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MessageBox from '@/components/ui/message-box';
import { Select as RadSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useUrlToImageConverter from '@/hooks/use-url-to-image-converter';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BreadcrumbItem, LeagueType } from '@/types';
import useLeagueValidator from '@/validators/use-league-validator';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { LoaderCircleIcon } from 'lucide-react';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';

type LeagueFormProp = {
    league: LeagueType;
};

export default function LeagueForm({ league }: LeagueFormProp) {
    const dropZone = useRef<any>(null);
    const [processing, setProcessing] = useState<boolean>(false);
    const [editing, setEditing] = useState<boolean>(false);
    const [message, setMessage] = useState<string[]>([]);
    const [messageType, setMessageType] = useState<'error' | 'success' | 'info'>('error');
    const [form, setForm] = useState<LeagueType>({
        id: null,
        name: '',
        name_ar: '',
        league_id: '',
        country_id: 0,
        status: true,
        meta_title: '',
        meta_title_ar: '',
        meta_desc: '',
        meta_desc_ar: '',
        keywords: '',
        keywords_ar: '',
        _method: 'post',
        season: '',
        is_cup: false,
        is_women: false,
        live_lineups: false,
        live_stats: false,
        live_pbp: false,
        by_pass: false,
        is_top: false,
        date_start: '',
        date_end: '',
        logo: '',
        sort: 0,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'League',
            href: route('league.index'),
        },
        {
            title: `Update ${league.name}`,
            href: '#',
        },
    ];

    const { error, value, errorKeys, messages } = useLeagueValidator(form);

    const resetForm = () => {
        dropZone.current?.reset();

        setForm({
            id: null,
            name: '',
            name_ar: '',
            league_id: '',
            country_id: 0,
            status: true,
            meta_title: '',
            meta_title_ar: '',
            meta_desc: '',
            meta_desc_ar: '',
            keywords: '',
            keywords_ar: '',
            _method: 'post',
            season: '',
            is_cup: false,
            is_women: false,
            by_pass: false,
            live_lineups: false,
            live_stats: false,
            live_pbp: false,
            is_top: false,
            date_start: '',
            date_end: '',
            logo: '',
            sort: 0,
        });

        window?.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        if (league) handleEdit();
    }, [league]);

    const handleEdit = async () => {
        setEditing(true);

        let image = await useUrlToImageConverter(league.logo as string);

        setForm((values) => ({
            ...values,
            id: league.id,
            name: league.name,
            name_ar: league.name_ar,
            league_id: league.league_id,
            is_top: Boolean(league.is_top) ? true : false,
            is_cup: Boolean(league.is_cup) ? true : false,
            is_women: Boolean(league.is_women) ? true : false,
            live_lineups: Boolean(league.live_lineups) ? true : false,
            live_stats: Boolean(league.live_stats) ? true : false,
            live_pbp: Boolean(league.live_pbp) ? true : false,
            sort: league.sort,
            country_id: league.country?.id ?? 0,
            status: Boolean(league.status) ? true : false,
            meta_title: league.seo ? league.seo.meta_title : '',
            meta_title_ar: league.seo ? league.seo.meta_title_ar : '',
            meta_desc: league.seo ? league.seo.meta_desc : '',
            meta_desc_ar: league.seo ? league.seo.meta_desc_ar : '',
            keywords: league.seo ? league.seo.keywords : '',
            keywords_ar: league.seo ? league.seo.keywords_ar : '',
            logo: image,
            date_start: league.date_start,
            date_end: league.date_end,
            _method: 'put',
        }));

        if (image) dropZone.current.getPreview(image);
    };

    const updateImage = (index: number, file: File) => {
        setForm((values) => ({
            ...values,
            ['logo']: file,
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

            const res = await axios.post(route('league.store'), form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setMessageType('success');
            setMessage((err) => [res.data.message]);

            if (editing) {
                router.get(route('league.index'));
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
            <Head title={`Update ${league.name}`} />
            {Boolean(Object.values(message).length) && (
                <MessageBox
                    type={messageType}
                    title={messageType == 'error' ? 'The following error(s) occured:' : null}
                    className="mb-5"
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
                                <Label htmlFor="name">Name (English)</Label>
                                <Input id="name" type="text" name="name" required value={form.name} onChange={(e) => handleChange(e)} />
                                {errorKeys.includes('name') && <p className="text-xs text-red-500">{messages['name']}</p>}
                            </div>

                            <div className="col-span-12 mb-1">
                                <Label htmlFor="titleAr">Name (Arabic)</Label>
                                <Input
                                    id="name_ar"
                                    type="text"
                                    dir="rtl"
                                    name="name_ar"
                                    required
                                    value={form.name_ar}
                                    onChange={(e) => handleChange(e)}
                                />
                                {errorKeys.includes('name_ar') && <p className="text-xs text-red-500">{messages['name_ar']}</p>}
                            </div>

                            <div className="col-span-12 mb-1">
                                <Label htmlFor="is_cup">Is Cup</Label>
                                <RadSelect
                                    defaultValue={'yes'}
                                    onValueChange={(val) => handleCustomChange('is_cup', val === 'yes' ? true : false)}
                                    value={form.is_cup ? 'yes' : 'no'}
                                    name="is_cup"
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

                            <div className="col-span-12 mb-1">
                                <Label htmlFor="is_top">Is Top Leagues</Label>
                                <RadSelect
                                    defaultValue={'yes'}
                                    onValueChange={(val) => handleCustomChange('is_top', val === 'yes' ? true : false)}
                                    value={form.is_top ? 'yes' : 'no'}
                                    name="is_top"
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

                            <div className="col-span-12 mb-1">
                                <Label htmlFor="statis_womenus">Is Women Sport</Label>
                                <RadSelect
                                    defaultValue={'yes'}
                                    onValueChange={(val) => handleCustomChange('is_women', val === 'yes' ? true : false)}
                                    value={form.is_women ? 'yes' : 'no'}
                                    name="is_women"
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

                            <div className="col-span-12 mb-1">
                                <Label htmlFor="live_lineups">Has Live Lineup</Label>
                                <RadSelect
                                    defaultValue={'yes'}
                                    onValueChange={(val) => handleCustomChange('live_lineups', val === 'yes' ? true : false)}
                                    value={form.live_lineups ? 'yes' : 'no'}
                                    name="live_lineups"
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

                            <div className="col-span-12 mb-1">
                                <Label htmlFor="live_stats">Has Live Stats</Label>
                                <RadSelect
                                    defaultValue={'yes'}
                                    onValueChange={(val) => handleCustomChange('live_stats', val === 'yes' ? true : false)}
                                    value={form.live_stats ? 'yes' : 'no'}
                                    name="live_stats"
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

                            <div className="col-span-12 mb-1">
                                <Label htmlFor="sort">Sort</Label>
                                <Input id="sort" type="number" name="sort" required value={form.sort} onChange={(e) => handleChange(e)} />
                                {errorKeys.includes('sort') && <p className="text-xs text-red-500">{messages['sort']}</p>}
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
                            <h3 className="font-bold">League settings</h3>
                        </div>
                        <div className="col-span-12 mb-1">
                            <h3 className="my-3 font-bold">Logo</h3>
                            <div className="grid grid-cols-12 gap-x-5">
                                <div className="col-span-12 h-40">
                                    <DropZone
                                        value={form.logo as any}
                                        onChange={(file: File) => updateImage(0, file)}
                                        className="h-full w-full border-solid"
                                        acceptedFilesType={{ 'image/*': [] }}
                                        allowMultiple={false}
                                        onDragMessage={'Drop an image.'}
                                        ref={dropZone}
                                    />
                                </div>
                            </div>
                            {errorKeys.includes('logo') && <p className="text-xs text-red-500">{messages['logo']}</p>}
                        </div>
                        <div className="col-span-12">
                            <div className="col-span-12 mb-1">
                                <Label htmlFor="status">Status</Label>
                                <RadSelect
                                    defaultValue={'active'}
                                    onValueChange={(val) => handleCustomChange('status', val === 'active' ? true : false)}
                                    value={form.status ? 'active' : 'inactive'}
                                    name="status"
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select one" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </RadSelect>
                            </div>
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
