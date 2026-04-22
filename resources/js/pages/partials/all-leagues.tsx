import { Accordion, AccordionContent, AccordionHeader, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { AllLeague } from '@/types/match';
import { Link } from '@inertiajs/react';
import axios from 'axios';
import { ChevronUp, FilterIcon, RotateCwIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export default function AllLeagues() {
    const [value, setValue] = useState('0');
    const [visibleCountry, setVisibleCountry] = useState(0);
    const [allLeagues, setAllLeagues] = useState<AllLeague[]>([]);
    const [searchText, updateSearchText] = useState<string>('');

    useEffect(() => {
        getAllLeagues();
    }, []);

    const filteredAllLeagues = useMemo<AllLeague[]>(() => {
        let searched = allLeagues.filter(
            (item) =>
                item.name.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()) ||
                item.nameAr.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()),
        );

        if (searched.length == 1) {
            let country = allLeagues.find(
                (item) =>
                    item.name.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()) ||
                    item.nameAr.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()),
            );

            if (country) setVisibleCountry(country?.id);
        } else {
            setVisibleCountry(0);
        }

        return !searchText ? allLeagues : searched;
    }, [searchText, allLeagues]);

    const getAllLeagues = async () => {
        const res = await axios.get(route('all.leagues'));

        setAllLeagues(res.data);
    };

    const handleShowLeagues = (country: number) => {
        if (visibleCountry === country) {
            setVisibleCountry(0);
        } else {
            setVisibleCountry(country);
        }
    };

    const placeholderImage = '/assets/images/logo2.png';

    return (
        <div className="h-full rounded-sm">
            <div className="flex h-full flex-col">
                <Accordion
                    type="single"
                    defaultValue="0"
                    collapsible
                    value={value}
                    onValueChange={setValue}
                    className={cn('rounded-sm bg-gray-100 shadow-sm transition-all', value == '0' ? 'h-fit' : '')}
                >
                    <AccordionItem value={`0`} className="">
                        <AccordionHeader className="mb-0 w-full">
                            <AccordionTrigger className="w-full">
                                <div className="flex w-full cursor-pointer justify-start rounded-xl p-3 select-none">
                                    <div className="flex w-full justify-between">
                                        <p className="font-bold text-black">All leagues</p>
                                        <ChevronUp className={cn('text-black transition-all', value == `0` ? '-rotate-180' : '')} />
                                    </div>
                                </div>
                            </AccordionTrigger>
                        </AccordionHeader>
                        <AccordionContent className="flex flex-col rounded-b-sm p-5 transition-all">
                            <div className="!flex max-h-[47rem] flex-1 flex-col">
                                <div className="flex items-center justify-center rounded border border-gray-300 pl-1">
                                    <FilterIcon className="w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Filter by country e.g Qatar"
                                        className="h-full w-full p-1 outline-0 placeholder:text-xs focus:outline-0"
                                        value={searchText}
                                        onInput={(e) => updateSearchText((e.target as HTMLInputElement).value)}
                                    />
                                    <button
                                        onClick={() => updateSearchText('')}
                                        className={cn(
                                            'cursor-pointer pr-1 transition-all delay-75 hover:text-blue-950',
                                            searchText.length ? 'animate-fadein opacity-100' : 'animate-fadeout opacity-0',
                                        )}
                                        title="Clear search text"
                                    >
                                        <RotateCwIcon className="w-4" />
                                    </button>
                                </div>
                                <div className="scrollbar mt-5 h-full w-full flex-1 overflow-y-scroll">
                                    {filteredAllLeagues.length ? (
                                        filteredAllLeagues.map((country) => (
                                            <div
                                                className="flex cursor-pointer flex-col rounded-sm p-2 transition-all select-none hover:bg-gray-300"
                                                key={country.id}
                                                onClick={() => handleShowLeagues(country.id)}
                                            >
                                                <div className={cn('flex justify-between gap-x-2', visibleCountry == country.id && 'mb-2')}>
                                                    <div className="flex gap-x-3">
                                                        <div className="h-6 w-6 rounded-full border border-gray-200">
                                                            <img
                                                                className="h-full w-full rounded-full object-fill"
                                                                src={country.logo.split('.')[0] != `${country.id}` ? country.logo : placeholderImage}
                                                                alt={country.name}
                                                            />
                                                        </div>
                                                        <p className="flex-1 text-sm font-semibold capitalize select-none">{country.name}</p>
                                                    </div>
                                                    <ChevronUp
                                                        className={cn(
                                                            'text-gray-400 transition-all',
                                                            visibleCountry === country.id ? '-rotate-180' : '',
                                                        )}
                                                    />
                                                </div>
                                                {visibleCountry === country.id && (
                                                    <ul className="pl-1">
                                                        {country.leagues.map((league) => (
                                                            <li
                                                                className="list-item list-inside rounded-sm p-1 text-xs text-gray-600 select-none hover:bg-gray-600 hover:text-white"
                                                                key={league.id}
                                                            >
                                                                <Link
                                                                    href={route('index.league', { slug: league.slug })}
                                                                    className="flex items-center gap-x-2"
                                                                >
                                                                    <div className="h-5 w-5 rounded-full border border-gray-200">
                                                                        <img
                                                                            className="h-full w-full rounded-full object-fill"
                                                                            src={
                                                                                league.logo.split('.')[0] != `${league.leagueId}`
                                                                                    ? league.logo
                                                                                    : placeholderImage
                                                                            }
                                                                            alt={league.name}
                                                                        />
                                                                    </div>
                                                                    <p className="flex-1">{league.name}</p>
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex items-center justify-center">
                                            <p className="text-md font-bold text-gray-400">No result</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
}
