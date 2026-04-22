import { usePlaceholderImage } from '@/hooks/user-placeholder-image';
import { cn } from '@/lib/utils';
import { Standing } from '@/types/match';
import { Link, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

type LeagueTableProp = {
    table: Standing[];
    showFilter: boolean;
    teamsInView?: string[];
    className?: string;
    league?: number | null;
};

type TableFilter = 'overall' | 'away' | 'home';
type FilterType = TableFilter | 'all';

export default function LeagueTable({ table, showFilter = true, teamsInView, className, league }: LeagueTableProp) {
    const [showChampionBorder, setShowChampionBorder] = useState(false);
    const [showEuropaBorder, setShowEuropaBorder] = useState(false);
    const [showRelegationBorder, setShowRelegationBorder] = useState(false);
    const [showConferenceBorder, setShowConferenceBorder] = useState(false);
    const [filter, setFilter] = useState<TableFilter>('overall');
    const filters = useRef<TableFilter[]>(['overall', 'away', 'home']);
    const [tables, setTables] = useState<Standing[]>();
    const [tablesBackup, setTablesBackup] = useState<Standing[]>();

    useEffect(() => {
        setTables(table);
        setTablesBackup(table);
    }, [table]);

    const getColor = (form: string) => {
        if (form.toLowerCase() == 'w') return 'bg-green-500';
        if (form.toLowerCase() == 'l') return 'bg-red-500';
        if (form.toLowerCase() == 'd') return 'bg-gray-500';
    };

    const getBorderColor = (standing: Standing) => {
        if (filter == 'away' || filter == 'home') return 'border-transparent';

        if (standing.inChampions) return 'border-green-600';
        if (standing.inEuropa) return 'border-blue-950';
        if (standing.inRelegation) return 'border-red-500';
        if (standing.inConference) return 'border-yellow-600';
    };

    useEffect(() => {
        if (tables && tables.length) {
            const hasChamp = table.some((item) => item.inChampions == true);
            const hasEuropa = table.some((item) => item.inChampions == true);
            const hasRelegation = table.some((item) => item.inRelegation == true);
            const hasConference = table.some((item) => item.inConference == true);

            setShowChampionBorder(hasChamp);
            setShowEuropaBorder(hasEuropa);
            setShowRelegationBorder(hasRelegation);
            setShowConferenceBorder(hasConference);
        }
    }, [tables]);

    const getGd = (standing: Standing) => {
        if (filter === 'overall')
            return parseInt(standing.total.gd) < 0 ? standing.total.gd : `${standing.total.gd == '' ? '0' : `+${standing.total.gd}`}`;

        let gd = +standing[filter].gs - +standing[filter].ga;

        standing[filter].gd = gd.toString();

        return gd < 0 ? gd.toString() : `+${gd}`;
    };

    const getPoint = (standing: Standing) => {
        if (filter === 'overall') return standing.total.p;

        const winningPoint = 3;
        const drawPoint = 1;
        const losePoint = 0;

        const wins = +standing[filter].w;
        const loses = +standing[filter].l;
        const draws = +standing[filter].d;

        const p = wins * winningPoint + draws * drawPoint + loses * losePoint;

        standing[filter].p = p.toString();

        return standing[filter].p;
    };

    const handleChangeTab = (filter: TableFilter) => {
        setFilter(filter);

        if (!tables) return;

        if (filter == 'overall') {
            setTables(tablesBackup);
            return;
        }

        let tablesCopy = [...tables].sort((a, b) => +b[filter].p - +a[filter].p || +b[filter].gd - +a[filter].gd);

        setTables(tablesCopy);
    };

    const showTeam = (standing: Standing) => {
        const slug = `${standing.name
            .toLowerCase()
            .replace(/^\/|\/$/g, '')
            .split(' ')
            .join('-')}`;
        const ids = league ? `${standing.id}-${league}` : standing.id;

        router.get(
            route('soccer.show.team.index', {
                slug,
                ids,
            }),
        );
    };

    return (
        <div className={cn('rounded-sm py-5 shadow-sm', className)}>
            {showFilter && (
                <div className="flex gap-x-5 px-5">
                    {filters.current.map((item) => (
                        <button
                            className={cn(
                                'cursor-pointer rounded-full px-4 py-2 text-sm font-bold text-white capitalize hover:bg-blue-900',
                                item === filter ? 'bg-red-500' : 'bg-gray-500',
                            )}
                            onClick={() => handleChangeTab(item)}
                            key={item}
                        >
                            {item === 'overall' ? 'all' : item}
                        </button>
                    ))}
                </div>
            )}
            {tables?.length && (
                <div className="mt-5 w-full overflow-x-auto">
                    <table className="table w-full table-auto transition-all">
                        <thead>
                            <tr>
                                <th className="pb-1 pl-5 text-left text-xs">#</th>
                                <th className="pb-1 text-left text-xs"></th>
                                <th className="pb-1 text-left text-xs">PL</th>
                                <th className="pb-1 text-left text-xs">W</th>
                                <th className="pb-1 text-left text-xs">D</th>
                                <th className="pb-1 text-left text-xs">L</th>
                                <th className="pb-1 text-left text-xs">+/-</th>
                                <th className="pb-1 text-left text-xs">GD</th>
                                <th className="pb-1 text-left text-xs">PTS</th>
                                <th className="pb-1 text-left text-xs">Form</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tables.map((item, index) => (
                                <tr
                                    className={cn(
                                        'mb-1 w-full cursor-pointer border-l-3 hover:bg-gray-200',
                                        getBorderColor(item),
                                        teamsInView?.includes(item.id.toString()) ? 'bg-gray-300' : '',
                                    )}
                                    key={index}
                                >
                                    <td className="border-b border-gray-50 py-1.5 pl-5 text-xs font-bold">{index + 1}</td>
                                    <td className="border-b border-gray-50 py-1.5 text-xs font-bold whitespace-nowrap">
                                        <div className="flex items-center gap-x-3">
                                            <div className="h-6 w-6 overflow-hidden rounded-full border border-gray-200">
                                                <img
                                                    src={item.logo ? item.logo : usePlaceholderImage()}
                                                    alt={item.name}
                                                    className="h-full w-full object-contain"
                                                />
                                            </div>
                                            <Link
                                                href={route('soccer.show.team.index', {
                                                    slug: item.name.replace('/', ' ').toLowerCase().split(' ').join('-'),
                                                    ids: league ? `${item.id}-${league}` : item.id,
                                                })}
                                                className="hover:underline"
                                            >
                                                <p>{item.name}</p>
                                            </Link>
                                        </div>
                                    </td>
                                    <td className="border-b border-gray-50 py-1.5 text-xs font-bold">{item[filter].gp}</td>
                                    <td className="border-b border-gray-50 py-1.5 text-xs font-bold">{item[filter].w}</td>
                                    <td className="border-b border-gray-50 py-1.5 text-xs font-bold">{item[filter].d}</td>
                                    <td className="border-b border-gray-50 py-1.5 text-xs font-bold">{item[filter].l}</td>
                                    <td className="border-b border-gray-50 py-1.5 text-xs font-bold">
                                        {item[filter].gs}-{item[filter].ga}
                                    </td>
                                    <td className="border-b border-gray-50 py-1.5 text-xs font-bold">{getGd(item)}</td>
                                    <td className="border-b border-gray-50 py-1.5 text-xs font-bold">{getPoint(item)}</td>
                                    <td className="border-b border-gray-50 py-1.5 text-xs font-bold">
                                        <div className="flex gap-x-1">
                                            {item.recentForm
                                                ?.split('')
                                                .reverse()
                                                .map((form, index) => (
                                                    <div
                                                        key={index}
                                                        className={cn(
                                                            'flex h-6 w-6 items-center justify-center rounded-md p-2 font-bold text-white',
                                                            getColor(form),
                                                        )}
                                                    >
                                                        {form}
                                                    </div>
                                                ))}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="mt-5 flex gap-x-10 px-5">
                        {showChampionBorder && (
                            <div className="flex items-center gap-x-2">
                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                <p className="text-xs text-gray-600">Champions League</p>
                            </div>
                        )}
                        {showEuropaBorder && (
                            <div className="flex items-center gap-x-2">
                                <div className="h-2 w-2 rounded-full bg-blue-950"></div>
                                <p className="text-xs text-gray-600">Europa League</p>
                            </div>
                        )}
                        {showConferenceBorder && (
                            <div className="flex items-center gap-x-2">
                                <div className="h-2 w-2 rounded-full bg-yellow-600"></div>
                                <p className="text-xs text-gray-600">Conference League</p>
                            </div>
                        )}
                        {showRelegationBorder && (
                            <div className="flex items-center gap-x-2">
                                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                                <p className="text-xs text-gray-600">Relegation</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
