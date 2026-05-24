import { Link } from "@inertiajs/react";
import { t } from "i18next";

type ViewAllButtonProp = {
    href: string
}

export default function ViewAllButton({href}: ViewAllButtonProp) {
    return <Link
        className="flex h-fit w-fit items-center justify-center rounded-full border border-blue-300 dark:border-neutral-700 px-2 py-1.5 hover:bg-gray-300"
        href={href}
    >
        <p className="text-xs font-black">{t('View all')}</p>
        {/* <ChevronRight className="w-3" /> */}
    </Link>
}