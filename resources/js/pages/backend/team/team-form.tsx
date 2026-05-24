import { Button } from '@/components/ui/button';
import DropZone from '@/components/ui/dropzone';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MessageBox from '@/components/ui/message-box';
import { Select as RadSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useUrlToImageConverter from '@/hooks/use-url-to-image-converter';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import useTeamValidator from '@/validators/use-team-validator';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { JsonEditor } from 'json-edit-react';
import { LoaderCircleIcon } from 'lucide-react';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { TeamType } from '.';

type TeamFormProp = {
    team: TeamType;
};

export default function TeamForm({ team }: TeamFormProp) {
    const dropZone = useRef<any>(null);
    const dropZoneVenue = useRef<any>(null);
    const [processing, setProcessing] = useState<boolean>(false);
    const [editing, setEditing] = useState<boolean>(false);
    const [message, setMessage] = useState<string[]>([]);
    const [messageType, setMessageType] = useState<'error' | 'success' | 'info'>('error');
    const [form, setForm] = useState<TeamType>({
        id: null,
        team_id: 0,
        venue_id: 0,
        is_women: false,
        slug: '',
        is_national_team: false,
        country_id: null,
        name: '',
        name_ar: '',
        fullname: '',
        fullname_ar: '',
        founded: '',
        founded_ar: '',
        venue_name: '',
        venue_name_ar: '',
        venue_surface: '',
        leagues: {},
        venue_address: {},
        venue_city: {},
        venue_capacity: '',
        venue_capacity_ar: '',
        squad: {},
        coach: {},
        transfers: {},
        statistics: {},
        detailed_stats: {},
        sidelined: {},
        trophies: {},
        image: '',
        venue_image: '',
        meta_title: '',
        meta_title_ar: '',
        meta_desc: '',
        meta_desc_ar: '',
        keywords: '',
        keywords_ar: '',
        _method: 'post',
        reload: false,
        by_pass: false,
        created_at: '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Teams',
            href: route('team.index'),
        },
        {
            title: `Update ${team.name}`,
            href: '#',
        },
    ];

    const { error, value, errorKeys, messages } = useTeamValidator(form);

    const resetForm = () => {
        dropZone.current?.reset();

        setForm({
            id: null,
            slug: '',
            team_id: 0,
            venue_id: 0,
            is_women: false,
            is_national_team: false,
            country_id: null,
            name: '',
            name_ar: '',
            fullname: '',
            fullname_ar: '',
            founded: '',
            founded_ar: '',
            venue_name: '',
            venue_name_ar: '',
            venue_surface: '',
            leagues: {},
            venue_address: {},
            venue_city: {},
            venue_capacity: '',
            venue_capacity_ar: '',
            squad: {},
            coach: {},
            transfers: {},
            statistics: {},
            detailed_stats: {},
            sidelined: {},
            trophies: {},
            image: '',
            venue_image: '',
            meta_title: '',
            meta_title_ar: '',
            meta_desc: '',
            meta_desc_ar: '',
            keywords: '',
            keywords_ar: '',
            _method: 'post',
            reload: false,
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
        if (team) handleEdit();
    }, [team]);

    const handleEdit = async () => {
        setEditing(true);

        let image = await useUrlToImageConverter(team.image as string);
        let venueImage = await useUrlToImageConverter(team.venue_image as string);

        setForm((values) => ({
            ...values,
            id: team.id,
            team_id: team.team_id,
            venue_id: team.venue_id ?? 0,
            is_women: Boolean(team.is_women) ? true : false,
            is_national_team: Boolean(team.is_national_team) ? true : false,
            country_id: team.country?.id ?? 0,
            name: team.name,
            name_ar: team.name_ar,
            fullname: team.fullname,
            fullname_ar: team.fullname_ar ?? '',
            founded: team.founded ?? '',
            founded_ar: team.founded_ar ?? '',
            venue_name: team.venue_name,
            venue_name_ar: team.venue_name_ar ?? '',
            venue_surface: team.venue_surface,
            leagues: team.leagues,
            venue_address: team.venue_address,
            venue_city: team.venue_city,
            venue_capacity: team.venue_capacity,
            venue_capacity_ar: team.venue_capacity_ar ?? '',
            squad: team.squad,
            coach: team.coach,
            transfers: team.transfers,
            statistics: team.statistics,
            detailed_stats: team.detailed_stats,
            sidelined: team.sidelined ?? {},
            trophies: team.trophies,
            image: image,
            venue_image: venueImage,
            meta_title: team.seo ? team.seo.meta_title : '',
            meta_title_ar: team.seo ? team.seo.meta_title_ar : '',
            meta_desc: team.seo ? team.seo.meta_desc : '',
            meta_desc_ar: team.seo ? team.seo.meta_desc_ar : '',
            keywords: team.seo ? team.seo.keywords : '',
            keywords_ar: team.seo ? team.seo.keywords_ar : '',
            _method: 'put',
            reload: Boolean(team.reload) ? true : false,
            by_pass: false,
            created_at: team.created_at,
        }));

        if (image) dropZone.current.getPreview(image);
        if (venueImage) dropZoneVenue.current.getPreview(venueImage);
    };

    const updateImage = (key: number, file: File) => {
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

            const res = await axios.post(route('team.store'), form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setMessageType('success');
            setMessage((err) => [res.data.message]);

            if (editing) {
                router.get(route('team.index'));
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
            <Head title={`Update ${team.name}`} />
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
                                <Label htmlFor="name">Fullname (English)</Label>
                                <Input id="fullname" type="text" name="name" required value={form.fullname} onChange={(e) => handleChange(e)} />
                                {errorKeys.includes('fullname') && <p className="text-xs text-red-500">{messages['fullname']}</p>}
                            </div>

                            <div className="col-span-12 mb-1">
                                <Label htmlFor="titleAr">Fullname (Arabic)</Label>
                                <Input
                                    id="fullname_ar"
                                    type="text"
                                    dir="rtl"
                                    name="fullname_ar"
                                    required
                                    value={form.fullname_ar}
                                    onChange={(e) => handleChange(e)}
                                />
                                {errorKeys.includes('fullname_ar') && <p className="text-xs text-red-500">{messages['fullname_ar']}</p>}
                            </div>

                            <div className="col-span-12 mb-1">
                                <Label htmlFor="founded">Founded</Label>
                                <Input id="founded" type="text" name="name" required value={form.founded} onChange={(e) => handleChange(e)} />
                                {errorKeys.includes('founded') && <p className="text-xs text-red-500">{messages['founded']}</p>}
                            </div>

                            <div className="col-span-12 mb-1">
                                <Label htmlFor="venue_name">Venue name</Label>
                                <Input id="venue_name" type="text" name="name" required value={form.venue_name} onChange={(e) => handleChange(e)} />
                                {errorKeys.includes('venue_name') && <p className="text-xs text-red-500">{messages['venue_name']}</p>}
                            </div>

                            <div className="col-span-12 mb-1">
                                <Label htmlFor="venue_capacity">Venue capacity</Label>
                                <Input
                                    id="venue_capacity"
                                    type="text"
                                    name="name"
                                    required
                                    value={form.venue_capacity}
                                    onChange={(e) => handleChange(e)}
                                />
                                {errorKeys.includes('venue_capacity') && <p className="text-xs text-red-500">{messages['venue_capacity']}</p>}
                            </div>

                            <div className="col-span-12 mb-1">
                                <Label htmlFor="venue_surface">Venue surface</Label>
                                <Input
                                    id="venue_surface"
                                    type="text"
                                    name="name"
                                    required
                                    value={form.venue_surface}
                                    onChange={(e) => handleChange(e)}
                                />
                                {errorKeys.includes('venue_surface') && <p className="text-xs text-red-500">{messages['venue_surface']}</p>}
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
                                <Label htmlFor="is_national_team">Is National Team</Label>
                                <RadSelect
                                    defaultValue={'yes'}
                                    onValueChange={(val) => handleCustomChange('is_national_team', val === 'yes' ? true : false)}
                                    value={form.is_national_team ? 'yes' : 'no'}
                                    name="is_national_team"
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
                                <Label htmlFor="Leagues">Leagues</Label>
                                <div className="!w-full">
                                    <JsonEditor className="w-full" data={form.leagues} setData={(data) => handleCustomChange('leagues', data)} />
                                </div>
                            </div>

                            <div className="col-span-12 mb-1">
                                <Label htmlFor="venue_city">Venue City</Label>
                                <div className="!w-full">
                                    <JsonEditor
                                        className="w-full"
                                        data={form.venue_city}
                                        setData={(data) => handleCustomChange('venue_city', data)}
                                    />
                                </div>
                            </div>

                            <div className="col-span-12 mb-1">
                                <Label htmlFor="venue_address">Venue Address</Label>
                                <div className="!w-full">
                                    <JsonEditor
                                        className="w-full"
                                        data={form.venue_address}
                                        setData={(data) => handleCustomChange('venue_address', data)}
                                    />
                                </div>
                            </div>

                            <div className="col-span-12 mb-1">
                                <Label htmlFor="squad">Squad</Label>
                                <div className="!w-full">
                                    <JsonEditor className="w-full" data={form.squad} setData={(data) => handleCustomChange('squad', data)} />
                                </div>
                            </div>

                            <div className="col-span-12 mb-1">
                                <Label htmlFor="coach">Coach</Label>
                                <div className="!w-full">
                                    <JsonEditor className="w-full" data={form.coach} setData={(data) => handleCustomChange('coach', data)} />
                                </div>
                            </div>

                            <div className="col-span-12 mb-1">
                                <Label htmlFor="transfers">Transfers</Label>
                                <div className="!w-full">
                                    <JsonEditor className="w-full" data={form.transfers} setData={(data) => handleCustomChange('transfers', data)} />
                                </div>
                            </div>

                            <div className="col-span-12 mb-1">
                                <Label htmlFor="statistics">Statistics</Label>
                                <div className="!w-full">
                                    <JsonEditor
                                        className="w-full"
                                        data={form.statistics}
                                        setData={(data) => handleCustomChange('statistics', data)}
                                    />
                                </div>
                            </div>

                            <div className="col-span-12 mb-1">
                                <Label htmlFor="detailed_stats">Detailed Stats</Label>
                                <div className="!w-full">
                                    <JsonEditor
                                        className="w-full"
                                        data={form.detailed_stats}
                                        setData={(data) => handleCustomChange('detailed_stats', data)}
                                    />
                                </div>
                            </div>

                            <div className="col-span-12 mb-1">
                                <Label htmlFor="sidelined">Sidelined</Label>
                                <div className="!w-full">
                                    <JsonEditor className="w-full" data={form.sidelined} setData={(data) => handleCustomChange('sidelined', data)} />
                                </div>
                            </div>

                            <div className="col-span-12 mb-1">
                                <Label htmlFor="trophies">Trophies</Label>
                                <div className="!w-full">
                                    <JsonEditor className="w-full" data={form.trophies} setData={(data) => handleCustomChange('trophies', data)} />
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
                            <h3 className="font-bold">League settings</h3>
                        </div>
                        <div className="col-span-12 mb-1">
                            <h3 className="my-3 font-bold">Team Logo</h3>
                            <div className="grid grid-cols-12 gap-x-5">
                                <div className="col-span-12 h-40">
                                    <DropZone
                                        value={form.image as any}
                                        onChange={(file: File) => handleCustomChange('image', file)}
                                        className="h-full w-full border-solid"
                                        acceptedFilesType={{ 'image/*': [] }}
                                        allowMultiple={false}
                                        onDragMessage={'Drop an image.'}
                                        ref={dropZone}
                                    />
                                </div>
                            </div>
                            {errorKeys.includes('image') && <p className="text-xs text-red-500">{messages['image']}</p>}
                        </div>

                        <div className="col-span-12 mb-1">
                            <h3 className="my-3 font-bold">Venue Image</h3>
                            <div className="grid grid-cols-12 gap-x-5">
                                <div className="col-span-12 h-40">
                                    <DropZone
                                        value={form.venue_image as any}
                                        onChange={(file: File) => handleCustomChange('venue_image', file)}
                                        className="h-full w-full border-solid"
                                        acceptedFilesType={{ 'image/*': [] }}
                                        allowMultiple={false}
                                        onDragMessage={'Drop an image.'}
                                        ref={dropZoneVenue}
                                    />
                                </div>
                            </div>
                            {errorKeys.includes('venue_image') && <p className="text-xs text-red-500">{messages['venue_image']}</p>}
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
