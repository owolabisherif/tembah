export type News = {
    id: number,
    title: string;
    author?: string;
    imageUrl: string;
    club?: string;
    time: string;
    date: string;
    tags?: string;
    type: NewsType;
};

export type VideoNewsType = {
    id: number,
    title: string;
    author?: string;
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
