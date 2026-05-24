import Loader from '@/components/loader';
import Paginator from '@/components/ui/paginator';
import useStoredPage from '@/hooks/use-stored-page';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BreadcrumbItem, PaginatedType } from '@/types';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type StatType = {
    id: number;
    news: {
        id: number;
        title: string;
        title_ar: string;
    } | null;
    client_ip: string;
    user_agent: string;
    count: number;
    date: string;
};

export default function NewsStats() {
    const [processing, setProcessing] = useState(false);
    const [rows, setRows] = useState<StatType[]>([]);
    const [pageCount, setPageCount] = useState(0);
    const [itemPerPage, setItemPerPage] = useState(0);
    const { t, i18n } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'News',
            href: '#',
        },
        {
            title: 'Stats',
            href: route('news.stats'),
        },
    ];

    useEffect(() => {
        handleGetRows();
    }, []);

    const handleGetRows = async () => {
        setProcessing(true);
        let res = await axios.get<PaginatedType>(route('news.stats.show') + `?page=${useStoredPage('stats-page')}`);

        if (!res.data.data.length) {
            localStorage.setItem('news-page', '1');
            res = await axios.get<PaginatedType>(route('news.stats.show'));
        }

        setData(res.data);
        setProcessing(false);
    };

    const setData = (payload: PaginatedType) => {
        setPageCount(payload.last_page);
        setItemPerPage(payload.per_page);
        setRows(payload.data as StatType[]);
    };

    const handlePageClick = async ({ selected }: { selected: number }) => {
        const res = await axios.get<PaginatedType>(route('news.stats.show') + `?page=${selected + 1}`);
        localStorage.setItem('news-page', (selected + 1).toString());
        setData(res.data);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="List" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {Boolean(rows.length) && !processing ? (
                    <Paginator
                        data={rows}
                        intialPage={useStoredPage('stats-page') - 1}
                        pageCount={pageCount}
                        itemsPerPage={itemPerPage}
                        handlePageClick={handlePageClick}
                    >
                        <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl">
                            <div className="w-full overflow-x-auto">
                                <table className="mb-3 table w-full table-auto">
                                    <thead className="">
                                        <tr className="text-brand-slate border-b shadow-xs">
                                            <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('News')}</th>
                                            <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Client IP')}</th>
                                            <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('User Agent')}</th>
                                            <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Views')}</th>
                                            <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Date')}</th>
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
                                                <td className="text-brand-slate px-2 py-5 text-left text-sm">
                                                    {item.news?.title ?? 'None'} ({item.news?.title_ar ?? 'None'})
                                                </td>
                                                <td className="text-brand-slate px-2 py-5 text-left text-sm">{item.client_ip}</td>
                                                <td className="text-brand-slate px-2 py-5 text-left text-sm">{item.user_agent}</td>
                                                <td className="text-brand-slate px-2 py-5 text-left text-sm">{item.count}</td>
                                                <td className="text-brand-slate px-2 py-5 text-left text-sm">{item.date}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </Paginator>
                ) : processing ? (
                    <div className="flex h-full w-full items-center justify-center">
                        <Loader />
                    </div>
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <p className="text-xl font-bold">No stats yet, please check back.</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
