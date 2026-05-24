import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";
import Instagram from "../svgs/instagram";
import Facebook from "../svgs/facebook";
import Youtube from "../svgs/youtube";
import X from "../svgs/x";

type SocialIconsProp = {
    className?: string
}
export default function SocialIcons({className}: SocialIconsProp) {
    return (
        <div className={cn("flex gap-x-2", className)}>
            <a href="#" target="_blank" className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-black cursor-pointer hover:bg-gray-50 dark:bg-neutral-700 dark:text-white hover:dark:text-neutral-300">
                <Facebook classData="w-4" />
            </a>
            <a href="#" target="_blank" className="flex h-6 w-6 items-center justify-center rounded-md bg-white  text-black cursor-pointer hover:bg-gray-50 dark:bg-neutral-700 dark:text-white hover:dark:text-neutral-300">
                <X classData="w-4" />
            </a>
            <a href="#" target="_blank" className="flex h-6 w-6 items-center justify-center rounded-md bg-white  text-black cursor-pointer hover:bg-gray-50 dark:bg-neutral-700 dark:text-white hover:dark:text-neutral-300">
                <Instagram classData="w-4" />
            </a>
            <a href="#" target="_blank" className="flex h-6 w-6 items-center justify-center rounded-md bg-white  text-black cursor-pointer hover:bg-gray-50 dark:bg-neutral-700 dark:text-white hover:dark:text-neutral-300">
                <Youtube classData="w-4" />
            </a>
            <a href="#" target="_blank" className="flex h-6 w-6 items-center justify-center rounded-md bg-white  text-black cursor-pointer hover:bg-gray-50 dark:bg-neutral-700 dark:text-white hover:dark:text-neutral-300">
                <img src="/assets/svgs/whatsapp.svg" className="w-4 dark:bg-neutral-700 dark:text-white hover:dark:text-neutral-300" />
            </a>
        </div>
    )
}