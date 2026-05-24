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
import { BoxIcon, Edit3Icon, EyeIcon, TrashIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type ArticleType = {
    id: number;
    slug: string;
    slug_ar: string;
    title: string;
    title_ar: string;
    status: string;
    type: string;
    tags: string[] | null;
    categories: string[] | null;
    teams: string[] | null;
    leagues: string[] | null;
    players: string[] | null;
    created: string;
    scheduled: string | null;
    image: string | null;
    is_top: boolean;
    in_slider: boolean;
    author: {
        id: number;
        name: string;
    } | null;
};

export default function Index() {
    const [rows, setRows] = useState<ArticleType[]>([]);
    const [pageCount, setPageCount] = useState(0);
    const [itemPerPage, setItemPerPage] = useState(0);
    const [message, setMessage] = useState<string | null>(null);
    const [type, setType] = useState<MessageType>('success');
    const { t, i18n } = useTranslation();
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Article',
            href: '#',
        },
        {
            title: 'List',
            href: route('article.index'),
        },
    ];

    useEffect(() => {
        handleGetRows();
    }, []);

    const handleGetRows = async () => {
        let res = await axios.get<PaginatedType>(route('article.show') + `?page=${useStoredPage('article-page')}`);

        if (!res.data.data.length) {
            localStorage.setItem('article-page', '1');
            res = await axios.get<PaginatedType>(route('article.show'));
        }

        setData(res.data);
    };

    const handlePageClick = async ({ selected }: { selected: number }) => {
        const res = await axios.get<PaginatedType>(route('article.show') + `?page=${selected + 1}`);
        localStorage.setItem('article-page', (selected + 1).toString());
        setData(res.data);
    };

    const setData = (payload: PaginatedType) => {
        setPageCount(payload.last_page);
        setItemPerPage(payload.per_page);
        setRows(payload.data as ArticleType[]);

        console.log(payload.data);
    };

    const handleDelete = async (article: ArticleType) => {
        try {
            if (confirm('You are about to perform a delete request. proceed ?')) {
                const res = await axios.delete(route('article.delete', { article: article.id }));
                setType('success');
                setMessage(res.data.message);

                handleGetRows();
            }
        } catch (error: any) {
            setType('error');
            setMessage(error.response.data.message);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="List" />
            <div className="flex items-center justify-end px-3 py-3">
                <Link href={route('article.create')} className="rounded-sm bg-blue-900 px-3 py-2 text-sm text-white hover:bg-blue-700">
                    ADD ARTICLE
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
                    intialPage={useStoredPage('article-page') - 1}
                    pageCount={pageCount}
                    itemsPerPage={itemPerPage}
                    handlePageClick={handlePageClick}
                >
                    <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl">
                        <div className="w-full overflow-x-auto">
                            <table className="mb-3 table w-full table-auto">
                                <thead className="">
                                    <tr className="text-brand-slate border-b shadow-xs">
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Title')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Type')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Tags')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Categories')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Leagues')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Teams')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Players')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('Author')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm">{t('In slider')}</th>
                                        <th className="text-brand-slate px-2 py-4 text-left text-sm whitespace-nowrap">{t('Scheduled')}</th>
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
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm">
                                                <div className="flex items-center gap-x-2">
                                                    <div className="relative h-8 w-8 overflow-hidden rounded-full">
                                                        {item.image ? (
                                                            <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center">
                                                                <BoxIcon className="w-5" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="flex-1 font-bold">{`${item.title} (${item.title_ar})`}</p>
                                                </div>
                                            </td>
                                            <td className="px-2 py-1 text-left text-xs capitalize">
                                                <Status
                                                    text={item.type}
                                                    bgColor={
                                                        item.type == 'text' ? 'bg-blue-500' : item.type == 'video' ? 'bg-purple-500' : 'bg-pink-500'
                                                    }
                                                />
                                            </td>
                                            <td className="px-2 py-1 text-left text-xs capitalize">
                                                {item.tags ? (
                                                    item.tags.map((item, index) => (
                                                        <p className="text-xs" key={index}>
                                                            {item}
                                                        </p>
                                                    ))
                                                ) : (
                                                    <p>None</p>
                                                )}
                                            </td>
                                            <td className="px-2 py-1 text-left text-xs capitalize">
                                                {item.categories ? (
                                                    item.categories.map((item, index) => (
                                                        <p className="text-xs" key={index}>
                                                            {item}
                                                        </p>
                                                    ))
                                                ) : (
                                                    <p>None</p>
                                                )}
                                            </td>
                                            <td className="px-2 py-1 text-left text-xs capitalize">
                                                {item.leagues ? (
                                                    item.leagues.map((item, index) => (
                                                        <p className="text-xs" key={index}>
                                                            {item}
                                                        </p>
                                                    ))
                                                ) : (
                                                    <p>None</p>
                                                )}
                                            </td>
                                            <td className="px-2 py-1 text-left text-xs capitalize">
                                                {item.teams ? (
                                                    item.teams.map((item, index) => (
                                                        <p className="text-xs" key={index}>
                                                            {item}
                                                        </p>
                                                    ))
                                                ) : (
                                                    <p>None</p>
                                                )}
                                            </td>
                                            <td className="px-2 py-1 text-left text-xs capitalize">
                                                {item.players ? (
                                                    item.players.map((item, index) => (
                                                        <p className="text-xs" key={index}>
                                                            {item}
                                                        </p>
                                                    ))
                                                ) : (
                                                    <p>None</p>
                                                )}
                                            </td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm whitespace-nowrap">
                                                {item.author ? item.author.name : 'Tembah'}
                                            </td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm">
                                                <Status
                                                    text={Boolean(item.in_slider) ? 'Yes' : 'No'}
                                                    bgColor={Boolean(item.in_slider) ? 'bg-green-500' : 'bg-yellow-500'}
                                                />
                                            </td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm whitespace-nowrap">
                                                {item.scheduled ?? 'Not applicable'}
                                            </td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm whitespace-nowrap">{item.created}</td>
                                            <td className="text-brand-slate px-2 py-1 text-left text-sm">
                                                <Status
                                                    text={item.status ? 'Active' : 'Inactive'}
                                                    bgColor={item.status ? 'bg-green-500' : 'bg-red-500'}
                                                />
                                            </td>
                                            <td className="flex gap-x-2 py-2">
                                                <div className="h-8 w-8">
                                                    <Link
                                                        href={route('article.edit', { slug: item.slug })}
                                                        className="hover:bg-brand-black/90 flex w-full cursor-pointer items-center justify-center rounded-sm bg-green-500 p-1 font-bold text-white disabled:cursor-not-allowed"
                                                    >
                                                        <EyeIcon className="w-5 text-white" />
                                                    </Link>
                                                </div>
                                                <div className="h-8 w-8">
                                                    <Link
                                                        href={route('article.edit', { slug: item.slug })}
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
