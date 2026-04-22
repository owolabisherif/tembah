import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    return (
        <SidebarGroup className="px-2 py-0">
            {/* <SidebarGroupLabel>Platform</SidebarGroupLabel> */}
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild tooltip={{ children: item.title }}>
                            {item.isDropdown ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="w-full">
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild tooltip={{ children: item.title }}>
                                                <Link href="#" prefetch className="flex justify-between text-center">
                                                    <div className="flex items-center gap-x-2">
                                                        {item.icon && <item.icon className="w-4" />}
                                                        <span>{item.title}</span>
                                                    </div>
                                                    <ChevronRight />
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent side="right">
                                        {item.children?.map((subItem) => (
                                            <div key={subItem.title}>
                                                {subItem.isDropdown ? (
                                                    <DropdownMenuSub>
                                                        <DropdownMenuSubTrigger>
                                                            <Link href={subItem.href} prefetch className="flex items-center gap-x-3">
                                                                {subItem.icon && <subItem.icon className="w-4" />}
                                                                <span>{subItem.title}</span>
                                                            </Link>
                                                        </DropdownMenuSubTrigger>
                                                        <DropdownMenuSubContent>
                                                            {subItem.children?.map((subItemInner) => (
                                                                <SidebarMenuItem key={subItemInner.title}>
                                                                    <SidebarMenuButton
                                                                        asChild
                                                                        tooltip={{ children: subItemInner.title }}
                                                                        className="mb-1.5"
                                                                    >
                                                                        <Link href={subItemInner.href} prefetch>
                                                                            {subItemInner.icon && <subItemInner.icon />}
                                                                            <span>{subItemInner.title}</span>
                                                                        </Link>
                                                                    </SidebarMenuButton>
                                                                </SidebarMenuItem>
                                                            ))}
                                                        </DropdownMenuSubContent>
                                                    </DropdownMenuSub>
                                                ) : (
                                                    <SidebarMenuItem key={subItem.title}>
                                                        <SidebarMenuButton asChild tooltip={{ children: subItem.title }} className="mb-1.5">
                                                            <Link href={subItem.href} prefetch>
                                                                {subItem.icon && <subItem.icon />}
                                                                <span>{subItem.title}</span>
                                                            </Link>
                                                        </SidebarMenuButton>
                                                    </SidebarMenuItem>
                                                )}
                                            </div>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            )}
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
