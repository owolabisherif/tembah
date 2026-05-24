import { Button } from '@/components/ui/button';
import DropZone from '@/components/ui/dropzone';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MessageBox from '@/components/ui/message-box';
import { Select as RadSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useUrlToImageConverter from '@/hooks/use-url-to-image-converter';
import { cn } from '@/lib/utils';
import useAdValidator from '@/validators/use-ad-validator';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { LoaderCircleIcon } from 'lucide-react';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import { AdFormProp } from '../create';

type AdFormType = {
    id: number | null;
    title: string;
    type: string;
    url: string;
    priority: number;
    starts_at: Date;
    _method: string;
    ends_at: Date;
    status: boolean;
    images: any[];
    meta_title: string | null;
    meta_title_ar: string | null;
    meta_desc: string | null;
    meta_desc_ar: string | null;
};

interface SelectType {
    readonly value: string;
    readonly label: string;
    readonly color: string;
    readonly isFixed?: boolean;
    readonly isDisabled?: boolean;
}

export default function AdForm({ types, ad, ...prop }: AdFormProp) {
    const dropZone = useRef<any>(null);
    const [processing, setProcessing] = useState<boolean>(false);
    const [editing, setEditing] = useState<boolean>(false);
    const [message, setMessage] = useState<string[]>([]);
    const [messageType, setMessageType] = useState<'error' | 'success' | 'info'>('error');
    const [form, setForm] = useState<AdFormType>({
        id: null,
        title: '',
        type: '',
        url: '',
        priority: 0,
        _method: 'post',
        starts_at: new Date(),
        ends_at: new Date(),
        status: true,
        images: [''],
        meta_title: '',
        meta_title_ar: '',
        meta_desc: '',
        meta_desc_ar: '',
    });

    const { error, value, errorKeys, messages } = useAdValidator(form);

    const resetForm = () => {
        dropZone.current?.reset();

        setForm({
            id: null,
            title: '',
            type: '600x600',
            url: '',
            priority: 0,
            _method: 'post',
            status: true,
            starts_at: new Date(),
            ends_at: new Date(),
            images: [''],
            meta_title: '',
            meta_title_ar: '',
            meta_desc: '',
            meta_desc_ar: '',
        });

        window?.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
        });
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

    const updateImage = (index: number, file: File) => {
        let images = [...form.images];
        images[index] = file;

        setForm((values) => ({
            ...values,
            ['images']: images,
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

            const res = await axios.post(route('ad.store'), form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setMessageType('success');
            setMessage((err) => [res.data.message]);

            if (editing) {
                router.get(route('ad.index'));
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

    useEffect(() => {
        handleEdit();
    }, [ad]);

    const handleEdit = async () => {
        try {
            if (ad) {
                setEditing(true);

                let image = await useUrlToImageConverter(ad.image.name);

                setForm((values) => ({
                    ...values,
                    id: ad.id,
                    title: ad.title,
                    url: ad.url,
                    type: ad.type,
                    status: ad.status,
                    starts_at: ad.starts_at,
                    ends_at: ad.ends_at,
                    priority: +ad.priority,
                    meta_title: ad.seo ? ad.seo.meta_title : '',
                    meta_title_ar: ad.seo ? ad.seo.meta_title_ar : '',
                    meta_desc: ad.seo ? ad.seo.meta_desc : '',
                    meta_desc_ar: ad.seo ? ad.seo.meta_desc_ar : '',
                    _method: 'put',
                    images: [image],
                }));

                dropZone.current.getPreview(image);
            }
        } catch (error) {}
    };

    return (
        <>
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
            <form className="grid h-full grid-cols-12 gap-x-4" onSubmit={(e) => submit(e)}>
                <div className="col-span-8 h-full">
                    <div className={cn('border-brand-gray h-full rounded-sm border p-4 shadow-sm')}>
                        <div className="grid grid-cols-12 gap-x-3">
                            <div className="col-span-12 mb-1">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" type="text" name="title" required value={form.title} onChange={(e) => handleChange(e)} />
                                {errorKeys.includes('title') && <p className="text-xs text-red-500">{messages['title']}</p>}
                            </div>
                            <div className="col-span-12 mb-1">
                                <Label htmlFor="type">Type</Label>
                                <RadSelect value={form.type} defaultValue={form.type} onValueChange={(val) => handleCustomChange('type', val)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {types?.map((item) => (
                                            <SelectItem value={item.value} key={item.value}>
                                                {item.text}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </RadSelect>
                                {errorKeys.includes('type') && <p className="text-xs text-red-500">{messages['type']}</p>}
                            </div>
                            <div className="col-span-12 mb-1">
                                <Label htmlFor="priority">Priority</Label>
                                <Input
                                    id="priority"
                                    min="0"
                                    type="number"
                                    name="priority"
                                    required
                                    value={form.priority}
                                    onChange={(e) => handleChange(e)}
                                />
                                {errorKeys.includes('priority') && <p className="text-xs text-red-500">{messages['priority']}</p>}
                            </div>
                            <div className="col-span-12 mb-1">
                                <h3 className="my-3 font-bold">Media</h3>
                                <div className="grid grid-cols-12 gap-x-5">
                                    <div className="col-span-6 h-40 md:col-span-4">
                                        <DropZone
                                            value={form.images && form.images.length ? form.images[0] : ''}
                                            onChange={(file: File) => updateImage(0, file)}
                                            className="h-full border-solid"
                                            acceptedFilesType={{ 'image/*': [] }}
                                            allowMultiple={false}
                                            onDragMessage={'Drop an image.'}
                                            ref={dropZone}
                                        />
                                    </div>
                                </div>
                                {errorKeys.includes('images') && <p className="text-xs text-red-500">{messages['images']}</p>}
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
                            <h3 className="font-bold">Ad settings</h3>
                        </div>
                        <div className="col-span-12">
                            <div className="col-span-12 mb-1">
                                <Label htmlFor="web_url">External URL</Label>
                                <Input
                                    id="url"
                                    type="text"
                                    name="web_url"
                                    placeholder="Enter a valid url"
                                    value={form.url}
                                    onChange={(e) => handleChange(e)}
                                />
                                {errorKeys.includes('url') && <p className="text-xs text-red-500">{messages['url']}</p>}
                            </div>
                            <div className="col-span-12 mb-1">
                                <Label htmlFor="starts_at">Starts At</Label>
                                <div className="w-full">
                                    <DatePicker
                                        selected={form.starts_at}
                                        onChange={(date: any) => handleCustomChange('starts_at', date)}
                                        minDate={new Date()}
                                        dateFormat="MMMM d, yyyy h:mm aa"
                                        showTimeSelect
                                        className="!w-full rounded-sm border border-gray-300 p-1 shadow-sm focus:outline-0"
                                    />
                                </div>
                                {errorKeys.includes('starts_at') && <p className="text-xs text-red-500">{messages['starts_at']}</p>}
                            </div>
                            <div className="col-span-12 mb-1">
                                <Label htmlFor="ends_at">Ends At</Label>
                                <div className="w-full">
                                    <DatePicker
                                        selected={form.ends_at}
                                        onChange={(date: any) => handleCustomChange('ends_at', date)}
                                        minDate={new Date()}
                                        dateFormat="MMMM d, yyyy h:mm aa"
                                        showTimeSelect
                                        className="!w-full rounded-sm border border-gray-300 p-1 shadow-sm focus:outline-0"
                                    />
                                </div>
                                {errorKeys.includes('ends_at') && <p className="text-xs text-red-500">{messages['ends_at']}</p>}
                            </div>
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
                    </div>
                </div>
            </form>
        </>
    );
}
