import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MessageBox, { MessageType } from '@/components/ui/message-box';
import QuillEditor from '@/components/ui/quill-editor';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, SelectType } from '@/types';
import useSeoPageValidator from '@/validators/use-seo-page-validator';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';

type NewOption = {
    name: string;
};

export default function Index() {
    const bodyRef = useRef<any>(null);
    const bodyArRef = useRef<any>(null);
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Page',
            href: route('seo.page.index'),
        },
    ];

    const [messageType, setMessageType] = useState<MessageType>('error');
    const [message, setMessage] = useState<string[]>([]);
    const [processing, setProcessing] = useState<boolean>(false);
    const [form, setForm] = useState({
        id: null,
        page: '',
        slug: '',
        _method: 'post',
        meta_title: '',
        title: '',
        title_ar: '',
        meta_title_ar: '',
        meta_desc: '',
        meta_desc_ar: '',
        keywords: '',
        keywords_ar: '',
        has_body: false,
        is_default: false,
        body: '',
        body_ar: '',
    });

    const { error, value, errorKeys, messages } = useSeoPageValidator(form);

    const [pages, setPages] = useState<SelectType[]>([]);

    const getPages = async () => {
        let pageData: SelectType[] = [];
        const res = await axios.get(route('seo.page.show', { id: 0 }));

        for (const item of res.data) {
            pageData.push({ value: item.id.toString(), label: item.name.charAt(0).toUpperCase() + item.name.slice(1), color: '#000000' });
        }

        setPages(pageData);
    };

    useEffect(() => {
        getPages();
    }, []);

    const handleCustomChange = (key: string, val: any) => {
        if (key == 'page') getSeoData(val);

        setForm((values) => ({
            ...values,
            [key]: val,
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

    const getSeoData = async (id: any) => {
        try {
            setProcessing(true);
            const res = await axios.get(route('seo.page.show', { id }));

            if (res.data.seo) {
                const { meta_title, meta_title_ar, meta_desc, meta_desc_ar, keywords, keywords_ar } = res.data.seo;
                setForm((values) => ({
                    ...values,
                    meta_title: meta_title,
                    meta_title_ar: meta_title_ar,
                    meta_desc: meta_desc,
                    meta_desc_ar: meta_desc_ar,
                    keywords: keywords,
                    keywords_ar: keywords_ar,
                }));
            } else {
                setForm((values) => ({
                    ...values,
                    meta_title: '',
                    meta_title_ar: '',
                    meta_desc: '',
                    meta_desc_ar: '',
                    keywords: '',
                    keywords_ar: '',
                }));
            }

            setForm((values) => ({
                ...values,
                title: res.data.title,
                title_ar: res.data.title_ar,
                has_body: Boolean(res.data.has_body),
                is_default: Boolean(res.data.has_body),
                body: res.data.body,
                body_ar: res.data.body_ar,
                slug: res.data.slug,
            }));

            console.log(res.data);
        } catch (error: any) {
            setMessageType('error');
            setMessage([error.response.data.message]);
        } finally {
            setProcessing(false);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (error) {
            setMessageType('error');
            setMessage((err) => [...err, error.message]);
            return;
        }

        try {
            setProcessing(true);
            const res = await axios.post(route('seo.page.store'), form);
            getSeoData(form.page);
            setMessageType('success');
            setMessage([res.data.message]);
        } catch (error: any) {
            setMessageType('error');
            setMessage([error.response.data.message]);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="SEO - Page" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
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

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-12">
                        <div className="col-span-12 mb-1">
                            <Label htmlFor="Categories">Select a page</Label>

                            <Select value={form.page} defaultValue={form.page} onValueChange={(val) => handleCustomChange('page', val)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {pages?.map((item) => (
                                        <SelectItem value={item.value} key={item.value}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {errorKeys.includes('page') && <p className="text-xs text-red-500">{messages['page']}</p>}
                        </div>
                    </div>

                    {Boolean(form.has_body) && (
                        <>
                            <h1 className="my-5">Page Informaion</h1>

                            {form.slug != '' && (
                                <Link className="mb-5 block" href={route('pages', { slug: form.slug })}>
                                    <span className="font-bold text-red-500">Page link:</span> {route('pages', { slug: form.slug })}
                                </Link>
                            )}

                            <div className="col-span-12 mb-1">
                                <Label htmlFor="meta_title">Page title (English)</Label>
                                <Input
                                    id="title"
                                    type="text"
                                    name="title"
                                    placeholder="Enter page title"
                                    disabled={form.is_default}
                                    value={form.title ?? ''}
                                    onChange={(e) => handleChange(e)}
                                />

                                {errorKeys.includes('title') && <p className="text-xs text-red-500">{messages['title']}</p>}
                            </div>

                            <div className="col-span-12 mb-1">
                                <Label htmlFor="meta_title">Page title (Arabic)</Label>
                                <Input
                                    id="title_ar"
                                    dir="rtl"
                                    type="text"
                                    name="title_ar"
                                    placeholder="Enter page title (arabic)"
                                    value={form.title_ar ?? ''}
                                    disabled={form.is_default}
                                    onChange={(e) => handleChange(e)}
                                />

                                {errorKeys.includes('title_ar') && <p className="text-xs text-red-500">{messages['title_ar']}</p>}
                            </div>

                            <div className="col-span-12 mb-1">
                                <Label htmlFor="body">Page Content (English)</Label>
                                <QuillEditor
                                    ref={bodyRef}
                                    readOnly={false}
                                    value={form.body}
                                    onSelectionChange={null}
                                    onTextChange={null}
                                    onChange={(data: any) => handleCustomChange('body', data)}
                                    discardChange={null}
                                    textDirection="ltr"
                                />
                                {errorKeys.includes('body') && <p className="text-xs text-red-500">{messages['body']}</p>}
                            </div>
                            <div className="col-span-12 mb-1">
                                <Label htmlFor="body_ar">Page Content (Arabic)</Label>
                                <QuillEditor
                                    ref={bodyArRef}
                                    readOnly={false}
                                    value={form.body_ar}
                                    onSelectionChange={null}
                                    onTextChange={null}
                                    textDirection="rtl"
                                    onChange={(data: any) => handleCustomChange('body_ar', data)}
                                    discardChange={null}
                                />
                                {errorKeys.includes('body_ar') && <p className="text-xs text-red-500">{messages['body_ar']}</p>}
                            </div>
                        </>
                    )}

                    <h1 className="my-5">Pages Search Engine Optimization</h1>

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

                        {errorKeys.includes('meta_title') && <p className="text-xs text-red-500">{messages['meta_title']}</p>}
                    </div>
                    <div className="col-span-12 mb-1">
                        <Label htmlFor="meta_title_ar">Meta title (Arabic)</Label>
                        <Input
                            id="meta_title_ar"
                            type="text"
                            name="meta_title_ar"
                            dir="rtl"
                            placeholder="Enter meta title (arabic)"
                            value={form.meta_title_ar ?? ''}
                            onChange={(e) => handleChange(e)}
                        />
                        {errorKeys.includes('meta_title_ar') && <p className="text-xs text-red-500">{messages['meta_title_ar']}</p>}
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
                        {errorKeys.includes('meta_desc') && <p className="text-xs text-red-500">{messages['meta_desc']}</p>}
                    </div>

                    <div className="col-span-12 mb-1">
                        <Label htmlFor="meta_desc_ar">Meta description (Arabic)</Label>
                        <textarea
                            id="meta_desc_ar"
                            name="meta_desc_ar"
                            dir="rtl"
                            placeholder="Enter meta description (arabic)"
                            className="block w-full resize-none rounded-sm border border-input p-2 shadow-sm placeholder:text-xs focus:outline-0"
                            value={form.meta_desc_ar ?? ''}
                            onChange={(e) => handleChange(e)}
                        />
                        {errorKeys.includes('meta_desc_ar') && <p className="text-xs text-red-500">{messages['meta_desc_ar']}</p>}
                    </div>
                    <div className="mt-5 mb-2">
                        <p className="text-sm font-bold text-red-500">
                            <span className="text-black">Note:</span> Keywords should be comma seperated.
                        </p>
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
                            placeholder="Enter meta title (arabic)"
                            value={form.keywords_ar ?? ''}
                            onChange={(e) => handleChange(e)}
                        />
                        {errorKeys.includes('keywords_ar') && <p className="text-xs text-red-500">{messages['keywords_ar']}</p>}
                    </div>

                    <Button disabled={processing} className="disabled:bg-gray-300">
                        UPDATE
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
