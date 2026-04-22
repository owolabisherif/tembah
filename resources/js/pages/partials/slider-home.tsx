import MainHomeSlider from '@/components/main-home-slider';
import { cn } from '@/lib/utils';
import { News, NewsType } from '@/types/news';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { t } from 'i18next';
import { useState } from 'react';
import RecentStoriesTab from './recent-stories-tab';

export default function SliderHome() {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [newsType, setNewsType] = useState<NewsType>('recent');

    const news: News[] = [
        {
            id: 1,
            title: "Mohamed Salah enters the 2025 Ballon d'Or race",
            imageUrl: '/assets/others/image1.jpg',
            club: 'Liverpool',
            time: '20mins',
            tags: '#MohamedSalah #Liverpool #Ballon',
            type: 'recent',
            date: '20-7-2025',
        },
        {
            id: 2,
            title: "Mohamed Salah enters the 2025 Ballon d'Or race",
            imageUrl: '/assets/others/image1.jpg',
            club: 'Liverpool',
            time: '20mins',
            tags: '#MohamedSalah #Liverpool #Ballon',
            type: 'top',
            date: '20-7-2025',
        },
        {
            id: 3,
            title: "Mohamed Salah enters the 2025 Ballon d'Or race",
            imageUrl: '/assets/others/image1.jpg',
            club: 'Liverpool',
            time: '20mins',
            tags: '#MohamedSalah #Liverpool #Ballon',
            type: 'recent',
            date: '20-7-2025',
        },
        {
            id: 4,
            title: "Mohamed Salah enters the 2025 Ballon d'Or race",
            imageUrl: '/assets/others/image1.jpg',
            club: 'Liverpool',
            time: '20mins',
            tags: '#MohamedSalah #Liverpool #Ballon',
            type: 'recent',
            date: '20-7-2025',
        },
        {
            id: 5,
            title: "Mohamed Salah enters the 2025 Ballon d'Or race",
            imageUrl: '/assets/others/image1.jpg',
            club: 'Liverpool',
            time: '20mins',
            tags: '#MohamedSalah #Liverpool #Ballon #Ballon',
            type: 'top',
            date: '20-7-2025',
        },
    ];

    const handleChangeTab = (index: number) => {
        setSelectedIndex(index);

        var types: NewsType[] = ['recent', 'top'];

        setNewsType(types[index]);
    };

    return (
        <>
            <div className="flex h-96 max-h-96 w-full flex-row gap-x-2" dir="ltr">
                <div className="flex h-full flex-1 overflow-hidden rounded-sm bg-gray-500">
                    <MainHomeSlider />
                </div>
                <div className="w-80">
                    <TabGroup className="flex h-full w-full flex-col" selectedIndex={selectedIndex} onChange={handleChangeTab}>
                        <TabList className="mb-8 flex w-full justify-between border-b-2">
                            <Tab
                                className={cn(
                                    'cursor-pointer border-b-4 px-5 py-2 text-xs font-bold outline-0 hover:bg-gray-200 focus:outline-0',
                                    selectedIndex == 0 && 'border-amber-500',
                                )}
                            >
                                {t('Recent News')}
                            </Tab>
                            <Tab
                                className={cn(
                                    'cursor-pointer border-b-4 px-5 py-2 text-xs font-bold outline-0 hover:bg-gray-200 focus:outline-0',
                                    selectedIndex == 1 && 'border-amber-500',
                                )}
                            >
                                {t('Top Stories')}
                            </Tab>
                        </TabList>
                        <TabPanels className="h-full flex-1">
                            <TabPanel
                                className={cn(
                                    'flex h-full flex-col',
                                    news.filter((item) => item.type == newsType).length > 2 ? 'justify-between' : 'gap-y-3',
                                )}
                            >
                                {news
                                    .filter((item) => item.type === newsType)
                                    .map((item) => (
                                        <a className="cursor-pointer rounded-sm hover:bg-gray-200" key={item.id}>
                                            <RecentStoriesTab news={item} />
                                        </a>
                                    ))}
                            </TabPanel>
                            <TabPanel
                                className={cn(
                                    'flex h-full flex-col',
                                    news.filter((item) => item.type == newsType).length > 2 ? 'justify-between' : 'gap-y-3',
                                )}
                            >
                                {news
                                    .filter((item) => item.type === newsType)
                                    .map((item) => (
                                        <a className="cursor-pointer rounded-sm hover:bg-gray-200" key={item.id}>
                                            <RecentStoriesTab news={item} />
                                        </a>
                                    ))}
                            </TabPanel>
                        </TabPanels>
                    </TabGroup>
                </div>
            </div>
        </>
    );
}
