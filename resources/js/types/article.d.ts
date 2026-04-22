import { Author } from "./user";

export default interface Article {
    title: string,
    body: string,
    imageUrl: string,
    type: "video" | "image",
    tags: string,
    videoUrl?: string,
    author: Author,
    date: string,
    time: string,
}