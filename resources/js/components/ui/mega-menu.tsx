import * as React from "react";
import { DropdownMenu, DropdownMenuItem, DropdownMenuPortal, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuSeparator, DropdownMenuCheckboxItem, DropdownMenuItemIndicator, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuArrow } from "@radix-ui/react-dropdown-menu";
import { BellDotIcon, CheckIcon, ChevronRightIcon, MenuIcon, MoonIcon, SunIcon } from "lucide-react";
import { Link, usePage } from "@inertiajs/react";
import { SharedData } from "@/types";


const MegaMenu = ({children, ...props}: React.PropsWithChildren) => {
	const [bookmarksChecked, setBookmarksChecked] = React.useState(true);
	const [urlsChecked, setUrlsChecked] = React.useState(false);
	const [person, setPerson] = React.useState("pedro");
    const { auth } = usePage<SharedData>().props;
    const {title} = props as any

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
               
				{children}
			</DropdownMenuTrigger>

			<DropdownMenuPortal>
				<DropdownMenuContent className="DropdownMenuContent bg-blue-950 shadow-md px-5 py-4 z-50 rounded-sm text-white w-2/3" sideOffset={5}>
					<DropdownMenuItem className="cursor-pointer parent mb-4">
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
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenuPortal>
		</DropdownMenu>
	);
};

export default MegaMenu;