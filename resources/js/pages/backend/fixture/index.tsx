import Loader from '@/components/loader';
import MessageBox, { MessageType } from '@/components/ui/message-box';
import Paginator from '@/components/ui/paginator';
import useStoredPage from '@/hooks/use-stored-page';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BreadcrumbItem, PaginatedType, SEOType } from '@/types';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { BoxIcon, Edit3Icon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type TeamData = {
    teamId: number;
    logo: string | null;
    name: string;
    nameAr: string;
    ftScore: number;
    hasRed: boolean;
    hasYellow: boolean;
    hasYellowRed: boolean;
};

export interface FixtureType extends SEOType {
    id: number | null;
    fixture_id: number;
    static_id: number;
    league_id: number;
    away_team_id: number;
    home_team_id: number;
    league: string;
    country: string;
    date: string;
    slug: string;
    sort: number;
    by_pass: boolean;
    match?: any;
    seo?: SEOType;
    created_at: string;
    _method: string;
}

export default function Index() {
    const [rows, setRows] = useState<FixtureType[]>([]);
    const [pageCount, setPageCount] = useState(0);
    const [itemPerPage, setItemPerPage] = useState(0);
    const [message, setMessage] = useState<string | null>(null);
    const [type, setType] = useState<MessageType>('success');
    const { t, i18n } = useTranslation();

    useEffect(() => {
        handleGetRows();
    }, []);

    const handleGetRows = async () => {
        let res = await axios.get<PaginatedType>(route('fixtures.show') + `?page=${useStoredPage('player-page')}`);

        if (!res.data.data.length) {
            localStorage.setItem('player-page', '1');
            res = await axios.get<PaginatedType>(route('fixtures.show'));
        }

        setData(res.data);
    };

    const handlePageClick = async ({ selected }: { selected: number }) => {
        const res = await axios.get<PaginatedType>(route('fixtures.show') + `?page=${selected + 1}`);
        localStorage.setItem('player-page', (selected + 1).toString());
        setData(res.data);
    };

    const setData = (payload: PaginatedType) => {
        setPageCount(payload.last_page);
        setItemPerPage(payload.per_page);
        setRows(payload.data as FixtureType[]);
    };

    const handleDelete = async (payload: FixtureType) => {
        try {
            if (confirm('You are about to perform a delete request. proceed ?')) {
                const res = await axios.delete(route('fixtures.delete', { tag: payload.id }));
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
            title: 'Fixture',
            href: route('fixtures.index'),
        },
        {
            title: 'List',
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Players" />
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
                    intialPage={useStoredPage('player-page') - 1}
                    pageCount={pageCount}
                    itemsPerPage={itemPerPage}
                    handlePageClick={handlePageClick}
                >
                    <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl">
                        <div className="w-full overflow-x-auto">
                            <table className="mb-3 table w-full table-auto">
                                <thead className="">
                                    <tr className="text-brand-slate border-b shadow-xs">
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Static ID')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Fixture ID')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Home ID')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Home Team')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Away ID')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Away Team')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('League ID')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('League')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Country')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Date')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Time')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Halftime Score')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Fulltime Score')}</th>
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
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm whitespace-nowrap">{item.static_id}</td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm whitespace-nowrap">
                                                {item.fixture_id ? item.fixture_id : 'None'}
                                            </td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm whitespace-nowrap">
                                                {item.match!.homeTeam.teamId}
                                            </td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm">
                                                <div className="flex items-center gap-x-2">
                                                    <div className="relative h-8 w-8 overflow-hidden rounded-full">
                                                        {item.match!.homeTeam.logo && typeof item.match!.homeTeam.logo == 'string' ? (
                                                            <img
                                                                src={item.match!.homeTeam.logo}
                                                                alt={item.match!.homeTeam.name}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center">
                                                                <BoxIcon className="w-5" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="flex-1 font-bold capitalize">
                                                        {item.match!.homeTeam.name
                                                            ? `${item.match!.homeTeam.name} (${item.match!.homeTeam.nameAr})`
                                                            : 'None'}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm whitespace-nowrap">
                                                {item.match!.awayTeam.teamId}
                                            </td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm">
                                                <div className="flex items-center gap-x-2">
                                                    <div className="relative h-8 w-8 overflow-hidden rounded-full">
                                                        {item.match!.awayTeam.logo && typeof item.match!.awayTeam.logo == 'string' ? (
                                                            <img
                                                                src={item.match!.awayTeam.logo}
                                                                alt={item.match!.awayTeam.name}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center">
                                                                <BoxIcon className="w-5" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="flex-1 font-bold capitalize">
                                                        {item.match!.awayTeam.name
                                                            ? `${item.match!.awayTeam.name} (${item.match!.awayTeam.nameAr})`
                                                            : 'None'}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm whitespace-nowrap">{item.league_id}</td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm whitespace-nowrap">{item.league}</td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm whitespace-nowrap">{item.country}</td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm whitespace-nowrap">{item.date}</td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm whitespace-nowrap">{item.match!.time}</td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm whitespace-nowrap">
                                                {item.match!.halfTimeScore}
                                            </td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm whitespace-nowrap">
                                                {item.match!.fullTimeScore}
                                            </td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm font-bold whitespace-nowrap">
                                                {item.match!.status}
                                            </td>
                                            <td className="flex gap-x-2 py-2">
                                                <div className="h-8 w-8">
                                                    <Link
                                                        href={route('fixtures.edit', { fixture: item.id })}
                                                        className="hover:bg-brand-black/90 flex w-full cursor-pointer items-center justify-center rounded-sm bg-orange-500 p-1 font-bold text-white disabled:cursor-not-allowed"
                                                    >
                                                        <Edit3Icon className="w-5 text-white" />
                                                    </Link>
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
