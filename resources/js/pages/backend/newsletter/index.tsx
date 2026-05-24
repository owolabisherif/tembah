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
import { TrashIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type NewsletterType = {
    id: number;
    email: string;
    created_at: string;
    status: number;
};

export default function Index() {
    const [rows, setRows] = useState<NewsletterType[]>([]);
    const [pageCount, setPageCount] = useState(0);
    const [itemPerPage, setItemPerPage] = useState(0);
    const [message, setMessage] = useState<string | null>(null);
    const [type, setType] = useState<MessageType>('success');
    const { t, i18n } = useTranslation();

    useEffect(() => {
        handleGetRows();
    }, []);

    const handleGetRows = async () => {
        try {
            let res = await axios.get<PaginatedType>(route('newsletter.show') + `?page=${useStoredPage('newsletter-page')}`);
            console.log(res.data);

            if (!res.data.data.length) {
                localStorage.setItem('newsletter-page', '1');
                res = await axios.get<PaginatedType>(route('newsletter.show'));
            }

            setData(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handlePageClick = async ({ selected }: { selected: number }) => {
        const res = await axios.get<PaginatedType>(route('newsletter.show') + `?page=${selected + 1}`);
        localStorage.setItem('newsletter-page', (selected + 1).toString());
        setData(res.data);
    };

    const setData = (payload: PaginatedType) => {
        setPageCount(payload.last_page);
        setItemPerPage(payload.per_page);
        setRows(payload.data as NewsletterType[]);
    };

    const handleDelete = async (newsletter: NewsletterType) => {
        try {
            if (confirm('You are about to perform a delete request. proceed ?')) {
                const res = await axios.delete(route('newsletter.delete', { news: newsletter.id }));
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
            title: 'Newsletter',
            href: '#',
        },
        {
            title: 'Subscribers',
            href: route('newsletter.index'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="List" />
            <div className="flex items-center justify-end px-3 py-3">
                <Link href={route('newsletter.create')} className="rounded-sm bg-blue-900 px-3 py-2 text-sm text-white hover:bg-blue-700">
                    CREATE NEWSLETTER
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
                    intialPage={useStoredPage('newsletter-page') - 1}
                    pageCount={pageCount}
                    itemsPerPage={itemPerPage}
                    handlePageClick={handlePageClick}
                >
                    <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl">
                        <div className="w-full overflow-x-auto">
                            <table className="mb-3 table w-full table-auto">
                                <thead className="">
                                    <tr className="text-brand-slate border-b shadow-xs">
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Email')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm whitespace-nowrap">{t('Created')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Status')}</th>
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
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm whitespace-nowrap">{item.email}</td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm whitespace-nowrap">{item.created_at}</td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm">
                                                <Status
                                                    text={item.status ? 'Subscribed' : 'Unsubscribed'}
                                                    bgColor={item.status ? 'bg-green-500' : 'bg-red-500'}
                                                />
                                            </td>
                                            <td className="flex gap-x-2 py-2">
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
