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
import usePlayerValidator from '@/validators/use-player-validator';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { JsonEditor } from 'json-edit-react';
import { LoaderCircleIcon } from 'lucide-react';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { PlayerType } from '.';

type PlayerFormProp = {
    player: PlayerType;
};

export default function PlayerForm({ player }: PlayerFormProp) {
    const dropZone = useRef<any>(null);
    const dropZoneVenue = useRef<any>(null);
    const [processing, setProcessing] = useState<boolean>(false);
    const [editing, setEditing] = useState<boolean>(false);
    const [message, setMessage] = useState<string[]>([]);
    const [messageType, setMessageType] = useState<'error' | 'success' | 'info'>('error');
    const [form, setForm] = useState<PlayerType>({
        id: null,
        player_id: 0,
        team_id: 0,
        national_team_id: 0,
        name: '',
        name_ar: '',
        common_name: '',
        common_name_ar: '',
        firstname: '',
        firstname_ar: '',
        lastname: '',
        lastname_ar: '',
        fullname: '',
        fullname_ar: '',
        nationality_flag: '',
        nationality: '',
        nationality_ar: '',
        team: '',
        team_ar: '',
        team_flag: '',
        birthdate: '',
        birthdate_ar: '',
        age: '',
        age_ar: '',
        birth_country: '',
        birth_country_flag: '',
        birth_country_ar: '',
        birth_place: '',
        birth_place_ar: '',
        position: '',
        position_ar: '',
        height: '',
        height_ar: '',
        shirt: '',
        shirt_ar: '',
        weight: '',
        weight_ar: '',
        preferred_foot: '',
        preferred_foot_ar: '',
        market_value: '',
        image: '',
        statistic: {},
        statistic_cups: {},
        statistic_cups_intl: {},
        statistic_intl: {},
        trophies: {},
        transfers: {},
        sidelined: {},
        overall_clubs: {},
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
            title: 'Players',
            href: route('player.index'),
        },
        {
            title: `Update ${player.name}`,
            href: '#',
        },
    ];

    const { error, value, errorKeys, messages } = usePlayerValidator(form);

    const resetForm = () => {
        dropZone.current?.reset();

        setForm({
            id: null,
            player_id: 0,
            team_id: 0,
            national_team_id: 0,
            name: '',
            name_ar: '',
            common_name: '',
            common_name_ar: '',
            firstname: '',
            firstname_ar: '',
            lastname: '',
            lastname_ar: '',
            fullname: '',
            fullname_ar: '',
            nationality_flag: '',
            nationality: '',
            nationality_ar: '',
            team: '',
            team_ar: '',
            team_flag: '',
            birthdate: '',
            birthdate_ar: '',
            age: '',
            age_ar: '',
            birth_country: '',
            birth_country_flag: '',
            birth_country_ar: '',
            birth_place: '',
            birth_place_ar: '',
            position: '',
            position_ar: '',
            height: '',
            height_ar: '',
            shirt: '',
            shirt_ar: '',
            weight: '',
            weight_ar: '',
            preferred_foot: '',
            preferred_foot_ar: '',
            market_value: '',
            image: '',
            statistic: {},
            statistic_cups: {},
            statistic_cups_intl: {},
            statistic_intl: {},
            trophies: {},
            transfers: {},
            sidelined: {},
            overall_clubs: {},
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
        if (player) handleEdit();
    }, [player]);

    const handleEdit = async () => {
        setEditing(true);

        let image = await useUrlToImageConverter(player.image as string);

        setForm((values) => ({
            ...values,
            id: player.id,
            player_id: player.player_id,
            team_id: player.team_id,
            national_team_id: player.national_team_id,
            name: player.name,
            name_ar: player.name_ar,
            common_name: player.common_name,
            common_name_ar: player.common_name_ar,
            firstname: player.firstname,
            firstname_ar: player.firstname_ar,
            lastname: player.lastname,
            lastname_ar: player.lastname_ar,
            fullname: player.fullname,
            fullname_ar: player.fullname_ar,
            nationality_flag: player.nationality_flag,
            nationality: player.nationality,
            nationality_ar: player.nationality_ar,
            team: player.team,
            team_ar: player.team_ar,
            team_flag: player.team_flag,
            birthdate: player.birthdate,
            birthdate_ar: player.birthdate_ar,
            age: player.age,
            age_ar: player.age_ar,
            birth_country: player.birth_country,
            birth_country_flag: player.birth_country_flag,
            birth_country_ar: player.birth_country_ar,
            birth_place: player.birth_place,
            birth_place_ar: player.birth_place_ar,
            position: player.position,
            position_ar: player.position_ar,
            height: player.height,
            height_ar: player.height_ar,
            shirt: player.shirt,
            shirt_ar: player.shirt_ar,
            weight: player.weight,
            weight_ar: player.weight_ar,
            preferred_foot: player.preferred_foot,
            preferred_foot_ar: player.preferred_foot_ar,
            market_value: player.market_value,
            image: image,
            statistic: player.statistic,
            statistic_cups: player.statistic_cups,
            statistic_cups_intl: player.statistic_cups_intl,
            statistic_intl: player.statistic_intl,
            trophies: player.trophies,
            transfers: player.transfers,
            sidelined: player.sidelined,
            overall_clubs: player.overall_clubs,
            meta_title: player.seo ? player.seo.meta_title : '',
            meta_title_ar: player.seo ? player.seo.meta_title_ar : '',
            meta_desc: player.seo ? player.seo.meta_desc : '',
            meta_desc_ar: player.seo ? player.seo.meta_desc_ar : '',
            keywords: player.seo ? player.seo.keywords : '',
            keywords_ar: player.seo ? player.seo.keywords_ar : '',
            _method: 'put',
            reload: Boolean(player.reload) ? true : false,
            by_pass: false,
            created_at: player.created_at,
        }));

        if (image) dropZone.current.getPreview(image);
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

            const res = await axios.post(route('player.store'), form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setMessageType('success');
            setMessage((err) => [res.data.message]);

            if (editing) {
                router.get(route('player.index'));
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
            <Head title={`Update ${player.name}`} />
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

                            {/* <div className="col-span-12 mb-1">
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
                            </div> */}

                            <div className="col-span-12 mb-1">
                                <Label htmlFor="shirt">Shirt</Label>
                                <Input id="shirt" type="text" name="name" required value={form.shirt} onChange={(e) => handleChange(e)} />
                                {errorKeys.includes('shirt') && <p className="text-xs text-red-500">{messages['shirt']}</p>}
                            </div>

                            <div className="col-span-12 mb-1">
                                <Label htmlFor="market_value">Market Value</Label>
                                <Input
                                    id="market_value"
                                    type="text"
                                    name="name"
                                    required
                                    value={form.market_value}
                                    onChange={(e) => handleChange(e)}
                                />
                                {errorKeys.includes('market_value') && <p className="text-xs text-red-500">{messages['market_value']}</p>}
                            </div>

                            <div className="col-span-12 mb-1">
                                <Label htmlFor="position">Position</Label>
                                <Input id="position" type="text" name="name" required value={form.position} onChange={(e) => handleChange(e)} />
                                {errorKeys.includes('position') && <p className="text-xs text-red-500">{messages['position']}</p>}
                            </div>

                            <div className="col-span-12 mb-1">
                                <Label htmlFor="height">Height</Label>
                                <Input id="height" type="text" name="name" required value={form.height} onChange={(e) => handleChange(e)} />
                                {errorKeys.includes('height') && <p className="text-xs text-red-500">{messages['height']}</p>}
                            </div>

                            <div className="col-span-12 mb-1">
                                <Label htmlFor="weight">Weight</Label>
                                <Input id="weight" type="text" name="name" required value={form.weight} onChange={(e) => handleChange(e)} />
                                {errorKeys.includes('weight') && <p className="text-xs text-red-500">{messages['weight']}</p>}
                            </div>

                            <div className="col-span-12 mb-1">
                                <Label htmlFor="preferred_foot">Preffered foot</Label>
                                <Input
                                    id="preferred_foot"
                                    type="text"
                                    name="name"
                                    required
                                    value={form.preferred_foot}
                                    onChange={(e) => handleChange(e)}
                                />
                                {errorKeys.includes('preferred_foot') && <p className="text-xs text-red-500">{messages['preferred_foot']}</p>}
                            </div>

                            <div className="col-span-12 mb-1">
                                <Label htmlFor="birth_country">Birth country</Label>
                                <Input
                                    id="birth_country"
                                    type="text"
                                    name="name"
                                    required
                                    value={form.birth_country}
                                    onChange={(e) => handleChange(e)}
                                />
                                {errorKeys.includes('birth_country') && <p className="text-xs text-red-500">{messages['birth_country']}</p>}
                            </div>

                            <div className="col-span-12 mb-1">
                                <Label htmlFor="birth_place">Birth place</Label>
                                <Input id="birth_place" type="text" name="name" required value={form.birth_place} onChange={(e) => handleChange(e)} />
                                {errorKeys.includes('birth_place') && <p className="text-xs text-red-500">{messages['birth_place']}</p>}
                            </div>

                            <div className="col-span-12 mb-1">
                                <Label htmlFor="age">Age</Label>
                                <Input id="age" type="text" name="name" required value={form.age} onChange={(e) => handleChange(e)} />
                                {errorKeys.includes('age') && <p className="text-xs text-red-500">{messages['age']}</p>}
                            </div>

                            <div className="col-span-12 mb-1">
                                <Label htmlFor="transfers">Transfers</Label>
                                <div className="!w-full">
                                    <JsonEditor className="w-full" data={form.transfers} setData={(data) => handleCustomChange('transfers', data)} />
                                </div>
                            </div>

                            <div className="col-span-12 mb-1">
                                <Label htmlFor="statistics">Statistic</Label>
                                <div className="!w-full">
                                    <JsonEditor className="w-full" data={form.statistic} setData={(data) => handleCustomChange('statistic', data)} />
                                </div>
                            </div>

                            <div className="col-span-12 mb-1">
                                <Label htmlFor="detailed_stats">Cups Stats</Label>
                                <div className="!w-full">
                                    <JsonEditor
                                        className="w-full"
                                        data={form.statistic_cups}
                                        setData={(data) => handleCustomChange('statistic_cups', data)}
                                    />
                                </div>
                            </div>

                            <div className="col-span-12 mb-1">
                                <Label htmlFor="statistic_cups_intl">Inernational Cup Stats</Label>
                                <div className="!max-w-full">
                                    <JsonEditor
                                        className="w-full"
                                        data={form.statistic_cups_intl}
                                        setData={(data) => handleCustomChange('statistic_cups_intl', data)}
                                    />
                                </div>
                            </div>

                            <div className="col-span-12 mb-1">
                                <Label htmlFor="statistic_intl">Inernational Stats</Label>
                                <div className="!w-full">
                                    <JsonEditor
                                        className="w-full"
                                        data={form.statistic_intl}
                                        setData={(data) => handleCustomChange('statistic_intl', data)}
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

                            <div className="col-span-12 mb-1">
                                <Label htmlFor="overall_clubs">Overall club stats</Label>
                                <div className="!w-full">
                                    <JsonEditor
                                        className="h-52 !max-w-full"
                                        data={form.overall_clubs}
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
                        <div className="col-span-12 mb-1">
                            <h3 className="my-3 font-bold">Image</h3>
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
