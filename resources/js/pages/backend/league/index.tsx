import Loader from '@/components/loader';
import MessageBox, { MessageType } from '@/components/ui/message-box';
import Paginator from '@/components/ui/paginator';
import Status from '@/components/ui/status';
import useStoredPage from '@/hooks/use-stored-page';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BreadcrumbItem, LeagueType, PaginatedType } from '@/types';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { format, isValid, parse } from 'date-fns';
import { BoxIcon, Edit3Icon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Index() {
    const [rows, setRows] = useState<LeagueType[]>([]);
    const [pageCount, setPageCount] = useState(0);
    const [itemPerPage, setItemPerPage] = useState(0);
    const [message, setMessage] = useState<string | null>(null);
    const [type, setType] = useState<MessageType>('success');
    const { t, i18n } = useTranslation();

    useEffect(() => {
        handleGetRows();
    }, []);

    const handleGetRows = async () => {
        let res = await axios.get<PaginatedType>(route('league.show') + `?page=${useStoredPage('league-page')}`);

        if (!res.data.data.length) {
            localStorage.setItem('league-page', '1');
            res = await axios.get<PaginatedType>(route('league.show'));
        }

        setData(res.data);
    };

    const handlePageClick = async ({ selected }: { selected: number }) => {
        const res = await axios.get<PaginatedType>(route('league.show') + `?page=${selected + 1}`);
        localStorage.setItem('league-page', (selected + 1).toString());
        setData(res.data);
    };

    const setData = (payload: PaginatedType) => {
        setPageCount(payload.last_page);
        setItemPerPage(payload.per_page);
        setRows(payload.data as LeagueType[]);
    };

    const handleDelete = async (payload: LeagueType) => {
        try {
            if (confirm('You are about to perform a delete request. proceed ?')) {
                const res = await axios.delete(route('league.delete', { tag: payload.id }));
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
            title: 'League',
            href: route('league.index'),
        },
        {
            title: 'List',
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Leagues" />
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
                    intialPage={useStoredPage('league-page') - 1}
                    pageCount={pageCount}
                    itemsPerPage={itemPerPage}
                    handlePageClick={handlePageClick}
                >
                    <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl">
                        <div className="w-full overflow-x-auto">
                            <table className="mb-3 table w-full table-auto">
                                <thead className="">
                                    <tr className="text-brand-slate border-b shadow-xs">
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('League ID')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Name')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Country')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Season')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Top League?')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Cup')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Women?')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Live Lineup?')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Live Stats?')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Live Play by Play?')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Sort')}</th>
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
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm whitespace-nowrap">{item.league_id}</td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm">
                                                <div className="flex items-center gap-x-2">
                                                    <div className="relative h-8 w-8 overflow-hidden rounded-full">
                                                        {item.logo && typeof item.logo == 'string' ? (
                                                            <img src={item.logo} alt={item.name} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center">
                                                                <BoxIcon className="w-5" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <a
                                                        href={route('index.league', { slug: item.slug })}
                                                        target="__blank"
                                                        className="flex-1 font-bold capitalize hover:underline"
                                                    >
                                                        {item.name ? `${item.name} (${item.name_ar})` : 'None'}
                                                    </a>
                                                </div>
                                            </td>

                                            <td className="text-brand-slate px-2 py-1 text-left text-sm font-bold whitespace-nowrap capitalize">
                                                {item.country ? `${item.country.name} (${item.country.name_ar})` : 'None'}
                                            </td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm whitespace-nowrap">{item.season}</td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm">
                                                <Status text={item.is_top ? 'Yes' : 'No'} bgColor={item.is_top ? 'bg-green-500' : 'bg-red-500'} />
                                            </td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm">
                                                <Status text={item.is_cup ? 'Yes' : 'No'} bgColor={item.is_cup ? 'bg-green-500' : 'bg-red-500'} />
                                            </td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm">
                                                <Status text={item.is_women ? 'Yes' : 'No'} bgColor={item.is_women ? 'bg-green-500' : 'bg-red-500'} />
                                            </td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm">
                                                <Status
                                                    text={item.live_lineups ? 'Yes' : 'No'}
                                                    bgColor={item.live_lineups ? 'bg-green-500' : 'bg-red-500'}
                                                />
                                            </td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm">
                                                <Status
                                                    text={item.live_stats ? 'Yes' : 'No'}
                                                    bgColor={item.live_stats ? 'bg-green-500' : 'bg-red-500'}
                                                />
                                            </td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm">
                                                <Status text={item.live_pbp ? 'Yes' : 'No'} bgColor={item.live_pbp ? 'bg-green-500' : 'bg-red-500'} />
                                            </td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm whitespace-nowrap">{item.sort}</td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm">
                                                <Status
                                                    text={item.status ? 'Active' : 'Inactive'}
                                                    bgColor={item.status ? 'bg-green-500' : 'bg-red-500'}
                                                />
                                            </td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm whitespace-nowrap">
                                                {item.created_at && isValid(item.created_at)
                                                    ? format(parse(item.created_at, "yyyy-MM-dd'T'HH:mm:ss.SSSSSSX", new Date()), 'M/d/y H:m:s')
                                                    : item.created_at}
                                            </td>
                                            <td className="flex gap-x-2 py-2">
                                                <div className="h-8 w-8">
                                                    <Link
                                                        href={route('league.edit', { league: item.id })}
                                                        className="hover:bg-brand-black/90 flex w-full cursor-pointer items-center justify-center rounded-sm bg-orange-500 p-1 font-bold text-white disabled:cursor-not-allowed"
                                                    >
                                                        <Edit3Icon className="w-5 text-white" />
                                                    </Link>
                                                </div>
                                                {/* <div className="h-8 w-8">
                                                    <button
                                                        onClick={() => handleDelete(item)}
                                                        className="hover:bg-brand-black/90 flex w-full cursor-pointer items-center justify-center rounded-sm bg-red-500 p-1 font-bold text-white disabled:cursor-not-allowed"
                                                    >
                                                        <TrashIcon className="w-5 text-white" />
                                                    </button>
                                                </div> */}
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
