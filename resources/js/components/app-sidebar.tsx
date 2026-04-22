import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    BookOpen,
    Folder,
    Globe2Icon,
    HashIcon,
    ImagePlayIcon,
    ImagePlusIcon,
    ImagesIcon,
    ImageUpscaleIcon,
    LayoutGrid,
    ListCollapseIcon,
    ListPlusIcon,
    LucideInspect,
    MoveRightIcon,
    NewspaperIcon,
    PlusIcon,
    ShirtIcon,
    TagsIcon,
    TrendingUpIcon,
    TrophyIcon,
    UserCheck2,
    UserPenIcon,
    UserPlus2Icon,
    Users2Icon,
    UsersIcon,
} from 'lucide-react';
import AppLogoIcon from './app-logo-icon';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
        icon: LayoutGrid,
    },
    {
        title: 'Slider',
        href: route('slider.index'),
        icon: ImagesIcon,
    },
    {
        title: 'Ad',
        href: route('ad.index'),
        icon: ImagePlayIcon,
        isDropdown: true,
        children: [
            {
                title: 'List',
                href: route('ad.index'),
                icon: ImagePlayIcon,
            },
            {
                title: 'Create',
                href: route('ad.create'),
                icon: ImagePlusIcon,
            },
            {
                title: 'Requests',
                href: route('ad.request.index'),
                icon: ImageUpscaleIcon,
            },
        ],
    },
    {
        title: 'Author',
        href: route('author.index'),
        icon: Users2Icon,
        isDropdown: true,
        children: [
            {
                title: 'List',
                href: route('author.index'),
                icon: UsersIcon,
            },
            {
                title: 'Create',
                href: route('author.create'),
                icon: UserPlus2Icon,
            },
        ],
    },
    {
        title: 'Tag',
        href: route('author.create'),
        icon: HashIcon,
        isDropdown: true,
        children: [
            {
                title: 'List',
                href: route('tag.index'),
                icon: HashIcon,
            },
            {
                title: 'Create',
                href: route('tag.create'),
                icon: TagsIcon,
            },
        ],
    },
    {
        title: 'Category',
        href: route('category.create'),
        icon: ListCollapseIcon,
        isDropdown: true,
        children: [
            {
                title: 'List',
                href: route('category.index'),
                icon: ListCollapseIcon,
            },
            {
                title: 'Create',
                href: route('category.create'),
                icon: ListPlusIcon,
            },
        ],
    },
    {
        title: 'News',
        href: route('news.index'),
        icon: NewspaperIcon,
        isDropdown: true,
        children: [
            {
                title: 'List',
                href: route('news.index'),
                icon: NewspaperIcon,
            },
            {
                title: 'Create',
                href: route('news.create'),
                icon: PlusIcon,
            },
            {
                title: 'Stats',
                href: route('news.stats'),
                icon: TrendingUpIcon,
            },
            {
                title: 'Transfer',
                href: route('news.transfer.index'),
                icon: MoveRightIcon,
                isDropdown: true,
                children: [
                    {
                        title: 'List',
                        href: route('news.transfer.index'),
                        icon: NewspaperIcon,
                    },
                    {
                        title: 'Create',
                        href: route('news.transfer.create'),
                        icon: PlusIcon,
                    },
                    {
                        title: 'Stats',
                        href: route('news.transfer.stats'),
                        icon: TrendingUpIcon,
                    },
                ],
            },
        ],
    },
    {
        title: 'Articles',
        href: route('article.index'),
        icon: UserPenIcon,
        isDropdown: true,
        children: [
            {
                title: 'List',
                href: route('article.index'),
                icon: UserPenIcon,
            },
            {
                title: 'Create',
                href: route('article.create'),
                icon: PlusIcon,
            },
        ],
    },
    {
        title: 'Countries',
        href: route('country.index'),
        icon: Globe2Icon,
    },
    {
        title: 'Leagues',
        href: route('league.index'),
        icon: TrophyIcon,
    },
    {
        title: 'Teams',
        href: route('team.index'),
        icon: ShirtIcon,
    },
    {
        title: 'Players',
        href: route('player.index'),
        icon: UserCheck2,
    },
    {
        title: 'OAuths',
        href: route('oauth.index'),
        icon: LucideInspect,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { state } = useSidebar();

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="#" prefetch className={cn('flex whitespace-nowrap', state == 'collapsed' && 'justify-center')}>
                                <div className="h-9 w-9">
                                    <AppLogoIcon className="" />
                                </div>
                                <h3 className={cn('font-bold whitespace-nowrap', state === 'expanded' ? 'block' : 'hidden')}>Go to main site</h3>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
