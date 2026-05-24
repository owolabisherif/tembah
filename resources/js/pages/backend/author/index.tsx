import Loader from '@/components/loader';
import MessageBox, { MessageType } from '@/components/ui/message-box';
import Paginator from '@/components/ui/paginator';
import Status from '@/components/ui/status';
import useStoredPage from '@/hooks/use-stored-page';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BreadcrumbItem, PaginatedType } from '@/types';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { format, isValid, parse } from 'date-fns';
import { BoxIcon, Edit3Icon, TrashIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type AuthorType = {
    id: number;
    slug: number;
    name: string;
    name_ar: string;
    status: string;
    web_url: string;
    facebook: string;
    x: string;
    instagram: string;
    whatsapp: string;
    imageUrl: string | null;
    created_at: string;
};

export default function Index() {
    const [rows, setRows] = useState<AuthorType[]>([]);
    const [pageCount, setPageCount] = useState(0);
    const [itemPerPage, setItemPerPage] = useState(0);
    const [message, setMessage] = useState<string | null>(null);
    const [type, setType] = useState<MessageType>('success');
    const { t, i18n } = useTranslation();

    useEffect(() => {
        handleGetRows();
    }, []);

    const handleGetRows = async () => {
        let res = await axios.get<PaginatedType>(route('author.show') + `?page=${useStoredPage('author-page')}`);
        console.log(res.data);

        if (!res.data.data.length) {
            localStorage.setItem('author-page', '1');
            res = await axios.get<PaginatedType>(route('author.show'));
        }

        setData(res.data);
    };

    const handlePageClick = async ({ selected }: { selected: number }) => {
        const res = await axios.get<PaginatedType>(route('author.show') + `?page=${selected + 1}`);
        localStorage.setItem('author-page', (selected + 1).toString());
        setData(res.data);
    };

    const setData = (payload: PaginatedType) => {
        setPageCount(payload.last_page);
        setItemPerPage(payload.per_page);
        setRows(payload.data as AuthorType[]);
    };

    const handleDelete = async (payload: AuthorType) => {
        try {
            if (confirm('You are about to perform a delete request. proceed ?')) {
                const res = await axios.delete(route('author.delete', { author: payload.id }));
                setType('success');
                setMessage(res.data.message);

                handleGetRows();
            }
        } catch (error: any) {
            setType('error');
            setMessage(error.response.data.message);
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Author',
            href: '#',
        },
        {
            title: 'List',
            href: route('author.index'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Authors" />
            <div className="flex items-center justify-end px-3 py-3">
                <Link href={route('author.create')} className="rounded-sm bg-blue-900 px-3 py-2 text-sm text-white hover:bg-blue-700">
                    CREATE AUTHOR
                </Link>
            </div>
            <div className="px-3 py-3">
                {message && (
                    <MessageBox type={type} close={() => setMessage(null)} className="mb-5">
                        <p>{message}</p>
                    </MessageBox>
                )}
            </div>

            {Boolean(rows.length) ? (
                <Paginator
                    data={rows}
                    intialPage={useStoredPage('author-page') - 1}
                    pageCount={pageCount}
                    itemsPerPage={itemPerPage}
                    handlePageClick={handlePageClick}
                >
                    <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl">
                        <div className="w-full overflow-x-auto">
                            <table className="mb-3 table w-full table-auto">
                                <thead className="">
                                    <tr className="text-brand-slate border-b shadow-xs">
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Name')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Website')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Facebook')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('X')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Instagram')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('WhatsApp')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Status')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm whitespace-nowrap">{t('Created')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Action')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((item, index) => (
                                        <tr
                                            className={cn(
                                                'hover:bg-brand-light-gray/20 border-b',
                                                index + 1 != rows.length ? 'border-brand-gray/20' : 'border-transparent',
                                            )}
                                            key={item.id}
                                        >
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm">
                                                <div className="flex items-center gap-x-2">
                                                    <div className="relative h-8 w-8 overflow-hidden rounded-full">
                                                        {item.imageUrl ? (
                                                            <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center">
                                                                <BoxIcon className="w-5" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="flex-1 font-bold">{`${item.name} (${item.name_ar})`}</p>
                                                </div>
                                            </td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm whitespace-nowrap">
                                                {item.web_url ?? 'None'}
                                            </td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm whitespace-nowrap">
                                                {item.facebook ?? 'None'}
                                            </td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm whitespace-nowrap">{item.x ?? 'None'}</td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm whitespace-nowrap">
                                                {item.instagram ?? 'None'}
                                            </td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm whitespace-nowrap">
                                                {item.whatsapp ?? 'None'}
                                            </td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm">
                                                <Status
                                                    text={item.status ? 'Active' : 'Inactive'}
                                                    bgColor={item.status ? 'bg-green-500' : 'bg-red-500'}
                                                />
                                            </td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm whitespace-nowrap">
                                                {isValid(item.created_at)
                                                    ? format(parse(item.created_at, "yyyy-MM-dd'T'HH:mm:ss.SSSSSSX", new Date()), 'M/d/y H:m:s')
                                                    : item.created_at}
                                            </td>
                                            <td className="flex gap-x-2 py-2">
                                                <div className="h-8 w-8">
                                                    <Link
                                                        href={route('author.edit', { author: item.id })}
                                                        className="hover:bg-brand-black/90 flex w-full cursor-pointer items-center justify-center rounded-sm bg-orange-500 p-1 font-bold text-white disabled:cursor-not-allowed"
                                                    >
                                                        <Edit3Icon className="w-5 text-white" />
                                                    </Link>
                                                </div>
                                                <div className="h-8 w-8">
                                                    <button
                                                        onClick={() => handleDelete(item)}
                                                        className="hover:bg-brand-black/90 flex w-full cursor-pointer items-center justify-center rounded-sm bg-red-500 p-1 font-bold text-white disabled:cursor-not-allowed"
                                                    >
                                                        <TrashIcon className="w-5 text-white" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Paginator>
            ) : (
                <div>
                    <Loader />
                </div>
            )}
        </AppLayout>
    );
}
