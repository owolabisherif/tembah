import useNumberFormatter from '@/hooks/use-number-formatter';
import { usePlaceholderImage } from '@/hooks/user-placeholder-image';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import i18next, { t } from 'i18next';
import { PropsWithChildren } from 'react';
import { ShowTeamProp } from '.';
import Ad from '../partials/ad';

export default function Squad({ team, league, ...props }: PropsWithChildren<ShowTeamProp>) {
    return (
        <>
            <Ad />
            {team && team.coach ? (
                <div className="my-5 rounded-md p-3 shadow-md">
                    <h3 className="mb-2 font-bold">{t('Coach')}</h3>
                    <div className="flex w-full items-center gap-x-3">
                        <div className="h-8 w-8 overflow-hidden rounded-full border border-gray-200">
                            <img
                                src={team.coach.image ? team.coach.image : usePlaceholderImage()}
                                alt={team.coach.name}
                                className="h-full w-full object-contain"
                            />
                        </div>
                        <div className="flex flex-1 flex-col justify-start">
                            <p className="">{i18next.language == 'en' ? team.coach.name : team.coach.nameAr}</p>
                        </div>
                    </div>
                </div>
            ) : (
                ''
            )}
            <div className="overflow-x-auto rounded-md shadow-md">
                {team && team.squad.length ? (
                    <table className="mt-5 table w-full table-auto transition-all">
                        <thead>
                            <tr>
                                <th className={cn('py-3 text-xs whitespace-nowrap', i18next.language == 'en' ? 'pl-3 text-left' : 'pr-3 text-right')}>
                                    #
                                </th>
                                <th
                                    className={cn(
                                        'px-5 py-3 text-xs whitespace-nowrap md:px-0 md:whitespace-normal',
                                        i18next.language == 'en' ? 'text-left' : 'text-right',
                                    )}
                                >
                                    {t('Player')}
                                </th>
                                <th
                                    className={cn(
                                        'px-5 py-3 text-xs whitespace-nowrap md:px-0 md:whitespace-normal',
                                        i18next.language == 'en' ? 'text-left' : 'text-right',
                                    )}
                                >
                                    {t('Position')}
                                </th>
                                <th
                                    className={cn(
                                        'px-5 py-3 text-xs whitespace-nowrap md:px-0 md:whitespace-normal',
                                        i18next.language == 'en' ? 'text-left' : 'text-right',
                                    )}
                                >
                                    {t('Nationality')}
                                </th>
                                <th
                                    className={cn(
                                        'px-5 py-3 text-xs whitespace-nowrap md:px-0 md:whitespace-normal',
                                        i18next.language == 'en' ? 'text-left' : 'text-right',
                                    )}
                                >
                                    {t('Age')}
                                </th>
                                <th
                                    className={cn(
                                        'px-5 py-3 text-xs whitespace-nowrap md:px-0 md:whitespace-normal',
                                        i18next.language == 'en' ? 'text-left' : 'text-right',
                                    )}
                                >
                                    {t('Shirt')}
                                </th>
                                <th
                                    className={cn(
                                        'px-5 py-3 text-xs whitespace-nowrap md:px-0 md:whitespace-normal',
                                        i18next.language == 'en' ? 'text-left' : 'text-right',
                                    )}
                                >
                                    {t('Height')}
                                </th>
                                <th
                                    className={cn(
                                        'px-5 py-3 text-xs whitespace-nowrap md:px-0 md:whitespace-normal',
                                        i18next.language == 'en' ? 'text-left' : 'text-right',
                                    )}
                                >
                                    {t('Transfer value')}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {team.squad.map((item, index) => (
                                <tr className={cn('w-full cursor-pointer hover:bg-gray-200')} key={`${item.id}-${index}`}>
                                    <td className={cn('border-b border-gray-100 py-3 text-xs font-bold', i18next.language == 'en' ? 'pl-3' : 'pr-3')}>
                                        {index + 1}
                                    </td>
                                    <td className="border-b border-gray-100 px-5 py-3 text-xs font-bold whitespace-nowrap md:px-0">
                                        <div className="flex w-full items-center gap-x-3">
                                            <div className="h-8 w-8 overflow-hidden rounded-full border border-gray-200">
                                                <img
                                                    src={item.image ? item.image : usePlaceholderImage()}
                                                    alt={item.name}
                                                    className="h-full w-full object-contain"
                                                />
                                            </div>
                                            <div className="flex flex-1 flex-col justify-start">
                                                <Link
                                                    href={route('show.player', {
                                                        slug: item.slug,
                                                        shirt: item.shirt,
                                                        player: item.id,
                                                    })}
                                                    className="mb-1 hover:underline"
                                                >
                                                    {i18next.language == 'en' ? item.name : item.nameAr}
                                                </Link>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="border-b border-gray-100 px-5 py-3 text-xs font-bold md:px-0">{item.position ?? '-'}</td>
                                    <td className="border-b border-gray-100 px-5 py-3 text-xs font-bold md:px-0">
                                        {item.nationality ? (
                                            <div className="flex items-center gap-x-1">
                                                <div className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-200">
                                                    <img
                                                        className="h-full w-full rounded-full object-cover"
                                                        src={item.countryFlag ?? usePlaceholderImage()}
                                                    />
                                                </div>
                                                <p className="flex-1">{i18next.language == 'en' ? item.nationality : item.nationalityAr}</p>
                                            </div>
                                        ) : (
                                            '-'
                                        )}
                                    </td>
                                    <td className="border-b border-gray-100 px-5 py-3 text-xs font-bold md:px-0">{item.age ?? '-'}</td>
                                    <td className="border-b border-gray-100 px-5 py-3 text-xs font-bold md:px-0">{item.shirt ?? '-'}</td>
                                    <td className="border-b border-gray-100 px-5 py-3 text-xs font-bold md:px-0">{item.height ?? '-'}</td>
                                    <td className="border-b border-gray-100 px-5 py-3 text-xs font-bold md:px-0">
                                        {item.transferValue ? useNumberFormatter(+item.transferValue) : '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <>
                        <div className="flex w-full items-center justify-center p-3">
                            <p className="text-lg font-bold">{t('Nothing here to show. Please check back.')}</p>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
