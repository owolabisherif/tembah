import { FacebookIcon, InstagramIcon, XIcon, YoutubeIcon } from "lucide-react";

export default function SocialIcons() {
    return (
        <div className="flex gap-x-2">
            <button className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-black cursor-pointer hover:bg-gray-50">
                <FacebookIcon className="w-4" />
            </button>
            <button className="flex h-6 w-6 items-center justify-center rounded-md bg-white  text-black cursor-pointer hover:bg-gray-50">
                <XIcon className="w-4" />
            </button>
            <button className="flex h-6 w-6 items-center justify-center rounded-md bg-white  text-black cursor-pointer hover:bg-gray-50">
                <InstagramIcon className="w-4" />
            </button>
            <button className="flex h-6 w-6 items-center justify-center rounded-md bg-white  text-black cursor-pointer hover:bg-gray-50">
                <YoutubeIcon className="w-4" />
            </button>
            <button className="flex h-6 w-6 items-center justify-center rounded-md bg-white  text-black cursor-pointer hover:bg-gray-50">
                <img src="/assets/svgs/whatsapp.svg" className="w-4" />
            </button>
        </div>
    )
}