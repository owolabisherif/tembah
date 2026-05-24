export type News = {
    id: number,
    slug: string;
    slug_ar: string;
    title: string;
    type: string
    title_ar: string;
    body?: string;
    body_ar?: string;
    video_url: string | null;
    author: {
        slug: string
        slug_ar: string
        name: string
        name_ar: string
        image: {
            name: string
        } | null
    };
    images: {
        name: string
    }[];
    tags: {
        slug: string
        slug_ar: string
        title: string
        title_ar: string
    }[]
    club?: string;
    created_at: string;
    tags?: string;
    type?: NewsType;
};

export type VideoNewsType = {
    id: number,
    title: string;
    author?: {
        slug: string
        slug_ar: string
        name: string
        name_ar: string
        image: {
            name: string
        } | null
    };
    imageUrl: string;
    videoUrl: string;
    club?: string;
    time: string;
    date: string;
    tags?: string;
    type: NewsType;
};

export type VideoSourceType = {
    src: string; 
    type: string;
}


export type CategoryNewsList = {
    id: number,
    title: string;
    imageUrl: string;
    author?: string;
    club?: string;
    time?: string;
    date?: string;
    tags?: string;
    type?: NewsType;
};

export type NewsType = 'recent' | 'top';
