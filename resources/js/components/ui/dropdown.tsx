import * as React from "react";
import { DropdownMenu, DropdownMenuItem, DropdownMenuPortal, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuSeparator, DropdownMenuCheckboxItem, DropdownMenuItemIndicator, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuArrow } from "@radix-ui/react-dropdown-menu";
import { BellDotIcon, CheckIcon, ChevronRightIcon, MenuIcon, MoonIcon, SunIcon } from "lucide-react";
import { Link, usePage } from "@inertiajs/react";
import { SharedData } from "@/types";


const Dropdown = ({children}: React.PropsWithChildren) => {
	const [bookmarksChecked, setBookmarksChecked] = React.useState(true);
	const [urlsChecked, setUrlsChecked] = React.useState(false);
	const [person, setPerson] = React.useState("pedro");
    const { auth } = usePage<SharedData>().props;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				{children}
			</DropdownMenuTrigger>

			<DropdownMenuPortal>
				<DropdownMenuContent className="DropdownMenuContent bg-blue-950 shadow-md px-5 py-4 z-[130] rounded-sm text-white " sideOffset={5}>
                    {
                        auth.user && (
                            <>
                            <DropdownMenuItem className="p-0">
                                <Link
                                    href={route('dashboard')}
                                    className="inline-block  text-sm leading-normal focus:outline-0 outline-0 hover:outline-0 mb-4 hover:text-red-500 border-0"
                                >
                                    Dashboard
                                </Link>
                            </DropdownMenuItem>
                             <DropdownMenuItem className="cursor-pointer">
                                <Link
                                href={route('login')}
                                className="inline-block rounded-sm  text-sm leading-normal focus:outline-0 outline-0 mb-4 hover:text-red-500"
                                >
                                Favourites
                                </Link>
                            </DropdownMenuItem></>
                        )
                    }
                    {
                        !auth.user && (
                            <>
                                <DropdownMenuItem className="cursor-pointer">
                                    <Link
                                    href={route('login')}
                                    className="inline-block rounded-sm  text-sm leading-normal focus:outline-0 outline-0 mb-4 hover:text-red-500"
                                    >
                                    Sign in / Register
                                    </Link>
                                </DropdownMenuItem>
                               
                            </>
                        )
                    }
					{/* <DropdownMenuItem className="cursor-pointer parent mb-4">
						<div className="flex gap-x-3 items-center group">
                            <p className="text-sm group-hover:text-red-500 flex-1">Theme</p>
                            <button><SunIcon className="w-4.5 cursor-pointer"/></button>
                            <button><MoonIcon className="w-4.5 cursor-pointer"/></button>
                        </div>
					</DropdownMenuItem>
					<DropdownMenuItem className="cursor-pointer parent">
						<div className="flex gap-x-3 items-center group">
                            <p className="text-sm group-hover:text-red-500 flex-1">Notifications</p>
                            <button><BellDotIcon className="w-4.5 cursor-pointer"/></button>
                        </div>
					</DropdownMenuItem> */}
				</DropdownMenuContent>
			</DropdownMenuPortal>
		</DropdownMenu>
	);
};

export default Dropdown;