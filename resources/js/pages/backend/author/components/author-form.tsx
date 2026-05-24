import { Button } from '@/components/ui/button';
import DropZone from '@/components/ui/dropzone';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MessageBox from '@/components/ui/message-box';
import QuillEditor from '@/components/ui/quill-editor';
import { Select as RadSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useUrlToImageConverter from '@/hooks/use-url-to-image-converter';
import { cn } from '@/lib/utils';
import useAuthorValidator from '@/validators/use-author-validator';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { LoaderCircleIcon } from 'lucide-react';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { AuthorPropType } from '../create';

type AuthorFormType = {
    id: number | null;
    name: string;
    name_ar: string;
    about: string;
    about_ar: string;
    web_url: string | null;
    x: string | null;
    instagram: string | null;
    whatsapp: string | null;
    facebook: string | null;
    images: any[];
    meta_title: string | null;
    meta_title_ar: string | null;
    meta_desc: string | null;
    meta_desc_ar: string | null;
    _method: string;
    status: boolean;
};

interface SelectType {
    readonly value: string;
    readonly label: string;
    readonly color: string;
    readonly isFixed?: boolean;
    readonly isDisabled?: boolean;
}

type NewOption = {
    title?: string;
    titleAr?: string;
    location?: string;
};

export default function AuthorForm({ author }: AuthorPropType) {
    const aboutRef = useRef<any>(null);
    const aboutArRef = useRef<any>(null);
    const dropZone = useRef<any>(null);
    const [processing, setProcessing] = useState<boolean>(false);
    const [message, setMessage] = useState<string[]>([]);
    const [messageType, setMessageType] = useState<'error' | 'success' | 'info'>('error');
    const [editing, setEditing] = useState<boolean>(false);
    const [form, setForm] = useState<AuthorFormType>({
        id: null,
        name: '',
        name_ar: '',
        about: '',
        about_ar: '',
        images: [],
        meta_title: '',
        meta_title_ar: '',
        meta_desc: '',
        meta_desc_ar: '',
        web_url: '',
        x: '',
        instagram: '',
        whatsapp: '',
        facebook: '',
        status: true,
        _method: 'post',
    });

    const { error, value, errorKeys, messages } = useAuthorValidator(form);

    const resetForm = () => {
        dropZone.current?.reset();

        setForm({
            id: null,
            name: '',
            name_ar: '',
            about: '',
            about_ar: '',
            images: [],
            meta_title: '',
            meta_title_ar: '',
            meta_desc: '',
            meta_desc_ar: '',
            web_url: '',
            x: '',
            instagram: '',
            whatsapp: '',
            facebook: '',
            status: true,
            _method: 'post',
        });

        aboutRef.current.setContents([]);
        aboutArRef.current.setContents([]);
        aboutArRef.current.format('direction', 'rtl');
        aboutArRef.current.format('align', 'right');

        window?.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        if (author) {
            handleEdit();
        }
    }, [author]);

    const handleEdit = async () => {
        setEditing(true);

        let image = author.image ? await useUrlToImageConverter(author.image.name) : null;

        setForm((values) => ({
            ...values,
            id: author.id,
            name: author.name,
            name_ar: author.name_ar,
            about: author.about ?? '',
            about_ar: author.about_ar ?? '',
            web_url: author.wen_url ?? '',
            facebook: author.facebook ?? '',
            x: author.x ?? '',
            instagram: author.instagram ?? '',
            whatsapp: author.whatsapp ?? '',
            meta_title: author.seo ? author.seo.meta_title : '',
            meta_title_ar: author.seo ? author.seo.meta_title_ar : '',
            meta_desc: author.seo ? author.seo.meta_desc : '',
            meta_desc_ar: author.seo ? author.seo.meta_desc_ar : '',
            images: image ? [image] : [],
            _method: 'put',
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

        console.log(form);

        if (error) {
            setMessageType('error');
            setMessage((err) => [...err, error.message]);
            return;
        }

        try {
            setProcessing(true);

            const res = await axios.post(route('author.store'), form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setMessageType('success');
            setMessage((err) => [res.data.message]);

            if (editing) {
                router.get(route('author.index'));
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
            <form className="grid h-full grid-cols-12 gap-x-4" onSubmit={(e) => submit(e)} encType="multipart/form-data">
                <div className="col-span-8 h-full">
                    <div className={cn('border-brand-gray h-full rounded-sm border p-4 shadow-sm')}>
                        <div className="grid grid-cols-12 gap-x-3">
                            <div className="col-span-12 mb-1">
                                <Label htmlFor="name">Name (English)</Label>
                                <Input id="name" type="text" name="name" required value={form.name} onChange={(e) => handleChange(e)} />
                                {errorKeys.includes('name') && <p className="text-xs text-red-500">{messages['name']}</p>}
                            </div>
                            <div className="col-span-12 mb-1">
                                <Label htmlFor="nameAr">Name (Arabic)</Label>
                                <Input
                                    id="name_ar"
                                    type="text"
                                    name="name_ar"
                                    dir="rtl"
                                    required
                                    value={form.name_ar}
                                    onChange={(e) => handleChange(e)}
                                />
                                {errorKeys.includes('name_ar') && <p className="text-xs text-red-500">{messages['name_ar']}</p>}
                            </div>

                            <div className="col-span-12 mb-1">
                                <Label htmlFor="about">About (English)</Label>
                                <QuillEditor
                                    ref={aboutRef}
                                    readOnly={false}
                                    value={form.about}
                                    onSelectionChange={null}
                                    onTextChange={null}
                                    onChange={(data: any) => handleCustomChange('about', data)}
                                    discardChange={null}
                                    textDirection="ltr"
                                />
                                {errorKeys.includes('about') && <p className="text-xs text-red-500">{messages['about']}</p>}
                            </div>
                            <div className="col-span-12 mb-1">
                                <Label htmlFor="about_ar">About (Arabic)</Label>
                                <QuillEditor
                                    ref={aboutArRef}
                                    readOnly={false}
                                    value={form.about_ar}
                                    onSelectionChange={null}
                                    onTextChange={null}
                                    textDirection="rtl"
                                    onChange={(data: any) => handleCustomChange('about_ar', data)}
                                    discardChange={null}
                                />
                                {errorKeys.includes('about_ar') && <p className="text-xs text-red-500">{messages['about_ar']}</p>}
                            </div>
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
                        <div className="mt-10">
                            <div className="flex w-full justify-end">
                                <Button className="cursor-pointer" disabled={processing}>
                                    {processing && <LoaderCircleIcon className="size-5 animate-spin" />} {editing ? 'UPDATE' : 'SUBMIT'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-4 h-full">
                    <div className="border-brand-gray h-full rounded-sm border p-3 shadow-sm">
                        <div className="mb-5">
                            <h3 className="font-bold">Author settings</h3>
                        </div>
                        <div className="col-span-12">
                            <div className="col-span-12 mb-1">
                                <Label htmlFor="web_url">Website</Label>
                                <Input
                                    id="web_url"
                                    type="text"
                                    name="web_url"
                                    placeholder="Enter a valid url"
                                    value={form.web_url ?? ''}
                                    onChange={(e) => handleChange(e)}
                                />
                                {errorKeys.includes('web_url') && <p className="text-xs text-red-500">{messages['web_url']}</p>}
                            </div>
                            <div className="col-span-12 mb-1">
                                <Label htmlFor="facebook">Facebook</Label>
                                <Input
                                    id="facebook"
                                    type="text"
                                    name="facebook"
                                    placeholder="Enter a valid url"
                                    value={form.facebook ?? ''}
                                    onChange={(e) => handleChange(e)}
                                />
                                {errorKeys.includes('facebook') && <p className="text-xs text-red-500">{messages['facebook']}</p>}
                            </div>
                            <div className="col-span-12 mb-1">
                                <Label htmlFor="instagram">Instagram</Label>
                                <Input
                                    id="instagram"
                                    type="text"
                                    name="instagram"
                                    placeholder="Enter a valid url"
                                    value={form.instagram ?? ''}
                                    onChange={(e) => handleChange(e)}
                                />
                                {errorKeys.includes('instagram') && <p className="text-xs text-red-500">{messages['instagram']}</p>}
                            </div>

                            <div className="col-span-12 mb-1">
                                <Label htmlFor="x">X</Label>
                                <Input
                                    id="x"
                                    type="text"
                                    name="x"
                                    placeholder="Enter a valid url"
                                    value={form.x ?? ''}
                                    onChange={(e) => handleChange(e)}
                                />
                                {errorKeys.includes('x') && <p className="text-xs text-red-500">{messages['x']}</p>}
                            </div>

                            <div className="col-span-12 mb-1">
                                <Label htmlFor="whatsapp">Whatsapp</Label>
                                <Input
                                    id="whatsapp"
                                    type="text"
                                    name="whatsapp"
                                    placeholder="Enter a valid url"
                                    value={form.whatsapp ?? ''}
                                    onChange={(e) => handleChange(e)}
                                />
                                {errorKeys.includes('whatsapp') && <p className="text-xs text-red-500">{messages['whatsapp']}</p>}
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
