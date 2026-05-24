import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    isDropdown?:boolean
    children?: SubNavItem[]
}

export interface SubNavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    isDropdown?: boolean
    children?: NavItem[]
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    periods: {
        value: strinsg,
        label: string
    }[]
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    adsUrl: string,
    currentSeason: string,
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}


export interface SelectItems {
    value: string | number,
    label: string,
    color?: string,
    imageUrl?: string,
}


export interface NewsTypes {
    value: string;
    text: string;
}

export interface SubmitScheduleButtonData {
    type: string;
    payload: string | Date;
};

export interface DropdownListItem {
    value: string
    text: string
}

export interface CreateNewsProp  {
    newsTypes: NewsTypes[];
    authors: DropdownListItem[] | null;
    teams: DropdownListItem[] | null;
    leagues: DropdownListItem[] | null;
    players?: DropdownListItem[];
    countries?: DropdownListItem[];
    news?: any
    article?: any
};

export interface SvgType {
    classData?: string
}



export type NewsOptionType = 'text' | 'video' | 'transfer';

export interface NewsFormType  {
    id: number | null;
    title: string;
    title_ar: string;
    type: NewsOptionType;
    _method: string
    author: string | null;
    body: string;
    body_ar: string;
    images: any[];
    categories: any[];
    tags: any[];
    leagues: any[];
    teams: any[];
    players: any[];
    countries: any[];
    action: SubmitScheduleButtonData | null;
    video: any;
    meta_title: string | null;
    meta_title_ar: string | null;
    meta_desc: string | null;
    meta_desc_ar: string | null;
    keywords: string | null;
    keywords_ar: string | null;
    status: boolean;
    is_featured: boolean;
    in_top: boolean;
    in_slider: boolean;
};


export interface PaginatedType {
    current_page: number
    data: any[],
    first_page_url: string
    from: number
    last_page: number
    last_page_url: string
    links: {
        active: boolean
        label: string | number
        url: string
    }[]
    next_page_url: string
    path: string
    per_page: number
    prev_page_url: string
    to: number
    total: number
}


export interface SelectType {
    readonly value: string;
    readonly label: string;
    readonly color: string;
    readonly isFixed?: boolean;
    readonly isDisabled?: boolean;
}


export interface NewOption {
    title?: string;
    titleAr?: string;
    location?: string;
};

export type CatTagType = {
    id: number;
    slug: string;
    title: string;
    title_ar: string;
    status: string;
    imageUrl: string;
    sort?: number;
    created_at: string;
};


export interface SEOType {
    meta_title: string | null;
    meta_title_ar: string | null;
    meta_desc: string | null;
    meta_desc_ar: string | null;
    keywords: string | null;
    keywords_ar: string | null;
}

export interface LeagueType extends SEOType {
    id: number | null;
    name: string;
    slug: string;
    name_ar: string;
    league_id: string;
    country_id: number;
    country?: {
        id: number;
        name: string;
        name_ar: string;
    } | null;
    status: boolean;
    season: string;
    is_cup: boolean;
    is_women: boolean;
    live_lineups: boolean;
    live_stats: boolean;
    live_pbp: boolean;
    is_top: boolean;
    logo: string | File;
    path?: string;
    date_start?: string;
    date_end?: string;
    sort: number;
    created_at?: string;
    by_pass?: boolean;
    seo?: SEOType;
    _method: string;
}