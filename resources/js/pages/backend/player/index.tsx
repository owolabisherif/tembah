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

export interface PlayerType extends SEOType {
    id: number | null;
    player_id: number;
    team_id: number;
    national_team_id: number;
    name: string;
    name_ar: string;
    common_name: string;
    common_name_ar: string;
    firstname: string;
    firstname_ar: string;
    lastname: string;
    lastname_ar: string;
    fullname: string;
    fullname_ar: string;
    nationality_flag: string;
    nationality: string;
    nationality_ar: string;
    team: string;
    team_ar: string;
    team_flag: string | File;
    birthdate: string;
    birthdate_ar: string;
    age: string;
    age_ar: string;
    birth_country: string;
    birth_country_flag: string;
    birth_country_ar: string;
    birth_place: string;
    birth_place_ar: string;
    position: string;
    position_ar: string;
    height: string;
    height_ar: string;
    shirt: string;
    shirt_ar: string;
    weight: string;
    weight_ar: string;
    preferred_foot: string;
    preferred_foot_ar: string;
    market_value: string;
    image: string | File;
    statistic: object;
    statistic_cups: object;
    statistic_cups_intl: object;
    statistic_intl: object;
    trophies: object;
    transfers: object;
    sidelined: object;
    overall_clubs: object;
    by_pass: boolean;
    reload: boolean;
    seo?: SEOType;
    created_at: string;
    _method: string;
}

export default function Index() {
    const [rows, setRows] = useState<PlayerType[]>([]);
    const [pageCount, setPageCount] = useState(0);
    const [itemPerPage, setItemPerPage] = useState(0);
    const [message, setMessage] = useState<string | null>(null);
    const [type, setType] = useState<MessageType>('success');
    const { t, i18n } = useTranslation();

    useEffect(() => {
        handleGetRows();
    }, []);

    const handleGetRows = async () => {
        let res = await axios.get<PaginatedType>(route('player.show') + `?page=${useStoredPage('player-page')}`);

        if (!res.data.data.length) {
            localStorage.setItem('player-page', '1');
            res = await axios.get<PaginatedType>(route('player.show'));
        }

        setData(res.data);
    };

    const handlePageClick = async ({ selected }: { selected: number }) => {
        const res = await axios.get<PaginatedType>(route('player.show') + `?page=${selected + 1}`);
        localStorage.setItem('player-page', (selected + 1).toString());
        setData(res.data);
    };

    const setData = (payload: PaginatedType) => {
        setPageCount(payload.last_page);
        setItemPerPage(payload.per_page);
        setRows(payload.data as PlayerType[]);
    };

    const handleDelete = async (payload: PlayerType) => {
        try {
            if (confirm('You are about to perform a delete request. proceed ?')) {
                const res = await axios.delete(route('player.delete', { tag: payload.id }));
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
            title: 'Player',
            href: route('player.index'),
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
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Player ID')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Name')}</th>
                                        {/* <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Fullname')}</th> */}
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Team ID')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Team')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('National Team ID')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Nationality')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Shirt')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Age')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Birthdate')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Birth Country')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Birth Place')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Position')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Height')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Weight')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Preferred foot')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Market value')}</th>
                                        {/* <th className="text-brand-slate px-2 py-4 text-left text-sm whitespace-nowrap">{t('Created')}</th> */}
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
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm whitespace-nowrap">{item.player_id}</td>
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
                                                    <p className="flex-1 font-bold capitalize">
                                                        {item.name ? `${item.name} (${item.name_ar})` : 'None'}
                                                    </p>
                                                </div>
                                            </td>
                                            {/* <td className="text-brand-slate px-2 py-1 text-left text-sm font-bold whitespace-nowrap capitalize">
                                                {item.fullname ? `${item.fullname} (${item.fullname_ar})` : 'None'}
                                            </td> */}
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm whitespace-nowrap">{item.team_id}</td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm">
                                                <div className="flex items-center gap-x-2">
                                                    <div className="relative h-8 w-8 overflow-hidden rounded-full">
                                                        {item.team_flag && typeof item.team_flag == 'string' ? (
                                                            <img src={item.team_flag} alt={item.name} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center">
                                                                <BoxIcon className="w-5" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="flex-1 font-bold capitalize">
                                                        {item.team ? `${item.team} (${item.team_ar})` : 'None'}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm whitespace-nowrap">
                                                {item.national_team_id ? item.national_team_id : '-'}
                                            </td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm">
                                                <div className="flex items-center gap-x-2">
                                                    <div className="relative h-8 w-8 overflow-hidden rounded-full">
                                                        {item.nationality_flag && typeof item.nationality_flag == 'string' ? (
                                                            <img
                                                                src={item.nationality_flag}
                                                                alt={item.nationality}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center">
                                                                <BoxIcon className="w-5" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="flex-1 font-bold capitalize">
                                                        {item.nationality ? `${item.nationality} (${item.nationality_ar})` : 'None'}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm font-bold whitespace-nowrap capitalize">
                                                {item.shirt ? `${item.shirt} (${item.shirt_ar})` : 'None'}
                                            </td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm font-bold whitespace-nowrap capitalize">
                                                {item.age ? `${item.age} (${item.age_ar})` : 'None'}
                                            </td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm font-bold whitespace-nowrap capitalize">
                                                {item.birthdate ? `${item.birthdate} (${item.birthdate_ar})` : 'None'}
                                            </td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm">
                                                <div className="flex items-center gap-x-2">
                                                    <div className="relative h-8 w-8 overflow-hidden rounded-full">
                                                        {item.birth_country_flag && typeof item.birth_country_flag == 'string' ? (
                                                            <img
                                                                src={item.birth_country_flag}
                                                                alt={item.birth_country}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center">
                                                                <BoxIcon className="w-5" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="flex-1 font-bold capitalize">
                                                        {item.birth_country ? `${item.birth_country} (${item.birth_country_ar})` : 'None'}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm whitespace-nowrap">
                                                {item.birth_place ? `${item.birth_place} (${item.birth_place_ar})` : 'None'}
                                            </td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm font-bold whitespace-nowrap">
                                                {item.position ? `${item.position} (${item.position_ar})` : 'None'}
                                            </td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm whitespace-nowrap">
                                                {item.height ? `${item.height} (${item.height_ar})` : 'None'}
                                            </td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm whitespace-nowrap">
                                                {item.weight ? `${item.weight} (${item.weight_ar})` : 'None'}
                                            </td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm whitespace-nowrap">
                                                {item.preferred_foot ? `${item.preferred_foot} (${item.preferred_foot_ar})` : 'None'}
                                            </td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm font-bold whitespace-nowrap">
                                                {item.market_value
                                                    ? new Intl.NumberFormat('en-US', {
                                                          style: 'currency',

                                                          currency: 'EUR',
                                                      }).format(+item.market_value)
                                                    : '-'}
                                            </td>
                                            {/* <td className="text-brand-slate px-2 py-1 text-left text-sm whitespace-nowrap">
                                                {item.created_at && isValid(item.created_at)
                                                    ? format(parse(item.created_at, "yyyy-MM-dd'T'HH:mm:ss.SSSSSSX", new Date()), 'M/d/y H:m:s')
                                                    : item.created_at}
                                            </td> */}
                                            <td className="flex gap-x-2 py-2">
                                                <div className="h-8 w-8">
                                                    <Link
                                                        href={route('player.edit', { player: item.id })}
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
