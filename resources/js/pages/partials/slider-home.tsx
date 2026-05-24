import MainHomeSlider, { Slider } from '@/components/main-home-slider';
import { cn } from '@/lib/utils';
import { News, NewsType } from '@/types/news';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import axios from 'axios';
import { t } from 'i18next';
import { MoreVerticalIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import RecentStoriesTab from './recent-stories-tab';

export default function SliderHome() {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [newsType, setNewsType] = useState<NewsType>('recent');
    const [newsTop, setTopNews] = useState<News[]>([]);
    const [sliders, setSliders] = useState<Slider[]>([]);
    const [newsRecent, setRecentNews] = useState<News[]>([]);
    const [loading, setLoading] = useState(false);

    const handleChangeTab = (index: number) => {
        setSelectedIndex(index);

        localStorage.setItem('top-recent-tab', index.toString());

        var types: NewsType[] = ['recent', 'top'];

        setNewsType(types[index]);
    };

    useEffect(() => {
        const index = localStorage.getItem('top-recent-tab');
        if (index) handleChangeTab(+index);
    }, []);

    const getData = async () => {
        try {
            setLoading(true);
            setSliders([]);

            const res = await axios.get(route('home.top-recent-news'));
            const slider = await axios.get(route('home.sliders'));

            const [newsData, sliderData] = await Promise.all([res, slider]);

            setSliders(sliderData.data);
            setTopNews(newsData.data.top);
            setRecentNews(newsData.data.recent);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <>
            <div className="flex h-fit max-h-96 w-full flex-row gap-x-2 md:mb-10 md:h-96" dir="ltr">
                <div className="flex h-fit flex-1 overflow-hidden rounded-sm">
                    <MainHomeSlider sliders={sliders} />
                </div>
                {(Boolean(newsTop.length) || Boolean(newsRecent.length)) && !loading ? (
                    <div className="hidden w-80 md:block">
                        <TabGroup className="flex h-full w-full flex-col" selectedIndex={selectedIndex} onChange={handleChangeTab}>
                            <TabList className="mb-8 flex w-full justify-between border-b-2">
                                {Boolean(newsRecent.length) && (
                                    <Tab
                                        className={cn(
                                            'cursor-pointer border-b-4 px-5 py-2 text-xs font-bold outline-0 hover:bg-gray-200 focus:outline-0',
                                            selectedIndex == 0 && 'border-amber-500',
                                        )}
                                    >
                                        {t('Recent News')}
                                    </Tab>
                                )}
                                {Boolean(newsTop.length) && (
                                    <Tab
                                        className={cn(
                                            'cursor-pointer border-b-4 px-5 py-2 text-xs font-bold outline-0 hover:bg-gray-200 focus:outline-0',
                                            selectedIndex == 1 && 'border-amber-500',
                                        )}
                                    >
                                        {t('Top Stories')}
                                    </Tab>
                                )}
                            </TabList>
                            <TabPanels className="h-full flex-1">
                                {Boolean(newsRecent.length) && (
                                    <TabPanel className={cn('flex h-full flex-col', newsRecent.length > 2 ? 'justify-between' : 'gap-y-3')}>
                                        {newsRecent.map((item) => (
                                            <div className="cursor-pointer rounded-sm hover:bg-gray-200" key={item.id}>
                                                <RecentStoriesTab news={item} page={null} type="recent-news" />
                                            </div>
                                        ))}
                                    </TabPanel>
                                )}
                                {Boolean(newsTop.length) && (
                                    <TabPanel className={cn('flex h-full flex-col', newsTop.length > 2 ? 'justify-between' : 'gap-y-3')}>
                                        {newsTop.map((item) => (
                                            <div className="cursor-pointer rounded-sm hover:bg-gray-200" key={item.id}>
                                                <RecentStoriesTab news={item} page={null} type="top-news" />
                                            </div>
                                        ))}
                                    </TabPanel>
                                )}
                            </TabPanels>
                        </TabGroup>
                    </div>
                ) : loading ? (
                    <div className="hidden w-80 animate-pulse flex-col md:block">
                        <div className="flex gap-x-10">
                            <div className="mb-3 h-3 w-full rounded-full bg-gray-200"></div>
                            <div className="mb-3 h-3 w-full rounded-full bg-gray-200"></div>
                        </div>
                        <div className="flex h-full flex-1 flex-col justify-between">
                            {Array.from({ length: 3 }).map((item, index) => (
                                <div className="flex gap-x-3 gap-y-4" key={index}>
                                    <div className="h-24 w-24 overflow-hidden rounded-sm bg-gray-200"></div>
                                    <div className="flex h-24 flex-1 flex-col overflow-hidden">
                                        <div className="mb-3 h-2 w-full rounded-full bg-gray-100"></div>
                                        <div className="flex justify-between">
                                            <div className="flex h-fit w-full flex-1 items-center gap-x-1">
                                                <div className="h-8 w-8 rounded-full bg-gray-100"></div>
                                                <p className="text-xs text-gray-100">Tembah • 1 hour ago</p>
                                            </div>
                                            <div className="rounded-full">
                                                <MoreVerticalIcon className="w-4 text-gray-100" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div></div>
                )}
            </div>
        </>
    );
}
