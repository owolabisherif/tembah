import SocialIcons from '@/components/ui/social-icons';
import { MailPlusIcon } from 'lucide-react';

export default function Footer() {
    return (
        <>
            <div className="mx-auto mt-10 h-80 w-full bg-gray-900 p-10 text-white">
                <div className="grid grid-cols-12">
                    <div className="col-span-4 flex flex-col gap-y-3">
                        <div className="mb-10 w-52">
                            <img src="/assets/images/logo.png" alt="Tembah logo" className="h-full w-full" />
                        </div>
                        <p className="mb-2 font-bold">Follow us</p>
                        <SocialIcons />
                    </div>
                    <div className="col-span-4">
                        <div className="flex flex-col">
                            <div className="flex flex-col gap-y-3">
                                <p className="font-bold">Home</p>
                                <p className="font-bold">Who we are</p>
                                <p className="font-bold">Transfers</p>
                                {/* <p>•</p> */}
                                <p className="font-bold">Terms of use</p>
                                <p className="font-bold">Advertise</p>
                                {/* <p>•</p> */}
                                <p className="font-bold">Cookie policy</p>
                                {/* <p>•</p> */}
                                <p className="font-bold">Privacy policy </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-4">
                        <div className="flex flex-col">
                            <div className="w-full">
                                <h3 className="text-2xl font-bold">Subscribe to Our Newsletter</h3>
                                <p className="mb-5 text-xs">Be the first to hear about latest news.</p>
                                <div className="flex">
                                    <button className="cursor-pointer rounded-l-sm bg-red-600 px-5 hover:bg-red-800">
                                        <MailPlusIcon />
                                    </button>
                                    <input
                                        type="text"
                                        className="w-full rounded-r-sm border border-l-0 border-gray-400 py-2 pl-3 outline-0 placeholder:text-xs focus:outline-0"
                                        placeholder="Please enter your email here."
                                    />
                                </div>
                                <p className="mt-10 text-xs">
                                    <span className="font-bold text-red-500">Note:</span> It is not allowed to employ automatic services (such as
                                    crawlers, robots, indexing, etc.) or other techniques on a regular or systematic basis.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between bg-red-600 p-1 text-white">
                <p className="font-xs text-xs font-bold">Copyright © 2025 All rights reserved.</p>
                <p className="text-xs">
                    <span className="text-xs font-bold">Made with ❤️ by:</span> Echo Media
                </p>
            </div>
        </>
    );
}
