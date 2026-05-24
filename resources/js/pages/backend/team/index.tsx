import Loader from '@/components/loader';
import MessageBox, { MessageType } from '@/components/ui/message-box';
import Paginator from '@/components/ui/paginator';
import Status from '@/components/ui/status';
import useStoredPage from '@/hooks/use-stored-page';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BreadcrumbItem, PaginatedType, SEOType } from '@/types';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { format, isValid, parse } from 'date-fns';
import { BoxIcon, Edit3Icon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface TeamType extends SEOType {
    id: number | null;
    team_id: number;
    venue_id: number;
    is_women: boolean;
    is_national_team: boolean;
    country_id: number | null;
    country?: {
        id: number;
        name: string;
        name_ar: string;
    } | null;
    slug: string;
    name: string;
    name_ar: string;
    fullname: string;
    fullname_ar: string;
    founded: string;
    founded_ar: string;
    venue_name: string;
    venue_name_ar: string;
    venue_surface: string;
    leagues: object;
    venue_address: object;
    venue_city: object;
    venue_capacity: string;
    venue_capacity_ar: string;
    squad: object;
    coach: object;
    transfers: object;
    statistics: object;
    detailed_stats: object;
    sidelined: object;
    trophies: object;
    image: string | File;
    venue_image: string | File;
    _method: string;
    reload: boolean;
    by_pass: boolean;
    seo?: SEOType;
    created_at: string;
}

export default function Index() {
    const [rows, setRows] = useState<TeamType[]>([]);
    const [pageCount, setPageCount] = useState(0);
    const [itemPerPage, setItemPerPage] = useState(0);
    const [message, setMessage] = useState<string | null>(null);
    const [type, setType] = useState<MessageType>('success');
    const { t, i18n } = useTranslation();

    useEffect(() => {
        handleGetRows();
    }, []);

    const handleGetRows = async () => {
        let res = await axios.get<PaginatedType>(route('team.show') + `?page=${useStoredPage('team-page')}`);

        if (!res.data.data.length) {
            localStorage.setItem('team-page', '1');
            res = await axios.get<PaginatedType>(route('team.show'));
        }

        setData(res.data);
    };

    const handlePageClick = async ({ selected }: { selected: number }) => {
        const res = await axios.get<PaginatedType>(route('team.show') + `?page=${selected + 1}`);
        localStorage.setItem('team-page', (selected + 1).toString());
        setData(res.data);
    };

    const setData = (payload: PaginatedType) => {
        setRows([]);
        setPageCount(payload.last_page);
        setItemPerPage(payload.per_page);
        setRows(payload.data as TeamType[]);
    };

    const getLeagueId = (league: any | null) => {
        if (league) {
            let leagueIds = JSON.parse(league);
            if (typeof leagueIds.league_id == 'string') {
                return leagueIds.league_id;
            } else {
                return leagueIds.league_id[0];
            }
        }
        return 1;
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Team',
            href: route('team.index'),
        },
        {
            title: 'List',
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Teams" />
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
                    intialPage={useStoredPage('team-page') - 1}
                    pageCount={pageCount}
                    itemsPerPage={itemPerPage}
                    handlePageClick={handlePageClick}
                >
                    <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl">
                        <div className="w-full overflow-x-auto">
                            <table className="mb-3 table w-full table-auto">
                                <thead className="">
                                    <tr className="text-brand-slate border-b shadow-xs">
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Team ID')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Name')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Fullname')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Venue')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Venue Capacity')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Country')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Women?')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('National Team?')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Founded')}</th>
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
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm whitespace-nowrap">{item.team_id}</td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm">
                                                <div className="flex items-center gap-x-2">
                                                    <div className="relative h-8 w-8 overflow-hidden rounded-full">
                                                        {item.image && typeof item.image == 'string' ? (
                                                            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center">
                                                                <BoxIcon className="w-5" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <a
                                                        target="_blank"
                                                        href={route('soccer.show.team.index', {
                                                            slug: `${item.slug}`,
                                                            ids: `${item.team_id}-${getLeagueId(item.leagues)}`,
                                                        })}
                                                        className="flex-1 font-bold capitalize"
                                                    >
                                                        {item.name ? `${item.name} (${item.name_ar})` : 'None'}
                                                    </a>
                                                </div>
                                            </td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm font-bold whitespace-nowrap capitalize">
                                                {item.fullname ? `${item.fullname} (${item.fullname_ar})` : 'None'}
                                            </td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm">
                                                <div className="flex items-center gap-x-2">
                                                    <div className="relative h-8 w-8 overflow-hidden rounded-full">
                                                        {item.venue_image && typeof item.venue_image == 'string' ? (
                                                            <img src={item.venue_image} alt={item.name} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center">
                                                                <BoxIcon className="w-5" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="flex-1 font-bold capitalize">
                                                        {item.venue_name ? `${item.venue_name} (${item.venue_name_ar})` : 'None'}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm font-bold whitespace-nowrap capitalize">
                                                {item.venue_capacity ? `${item.venue_capacity} (${item.venue_capacity_ar})` : 'None'}
                                            </td>

                                            <td className="text-brand-slate px-2 py-1 text-left text-sm font-bold whitespace-nowrap capitalize">
                                                {item.country ? `${item.country.name} (${item.country.name_ar})` : 'None'}
                                            </td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm">
                                                <Status text={item.is_women ? 'Yes' : 'No'} bgColor={item.is_women ? 'bg-green-500' : 'bg-red-500'} />
                                            </td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm">
                                                <Status
                                                    text={item.is_national_team ? 'Yes' : 'No'}
                                                    bgColor={item.is_national_team ? 'bg-green-500' : 'bg-red-500'}
                                                />
                                            </td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm whitespace-nowrap">
                                                {item.founded ? `${item.founded} (${item.founded_ar})` : 'None'}
                                            </td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm whitespace-nowrap">
                                                {item.created_at && isValid(item.created_at)
                                                    ? format(parse(item.created_at, "yyyy-MM-dd'T'HH:mm:ss.SSSSSSX", new Date()), 'M/d/y H:m:s')
                                                    : item.created_at}
                                            </td>
                                            <td className="flex gap-x-2 py-2">
                                                <div className="h-8 w-8">
                                                    <Link
                                                        href={route('team.edit', { team: item.id })}
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
