import { cn } from "@/lib/utils"
import { XCircleIcon } from "lucide-react"
import { PropsWithChildren } from "react"

export type MessageType = "success" | "error" | "info"

type MessageBoxProp = {
    type: MessageType
    title?: string| null
    className?: string 
    close?: () => void
}

export default function MessageBox({type, title,className, close, children, ...props}: PropsWithChildren<MessageBoxProp>) {

    let typeColors: {
        [key: string]: string
    } = {
        success: "green-500",
        error: "red-500",
        info: "yellow-400"
    }

    return <div className={cn("flex-col w-full rounded-sm shadow-xs", `bg-${typeColors[type]}`, className)}>
        {
            title ? <div className={cn("border-b p-2", `border-b-gray-50/20 flex justify-between`)}>
                <p className="text-sm font-bold text-white">{title}</p>
                {
                    close ? <button className="cursor-pointer" onClick={() => close()}>
                    <XCircleIcon className="size-5 text-white" />
                        </button> : ''
                }
                
            </div> : ''
        }
        <div className="px-2 py-4 text-white shadow-xs flex justify-between">
            <div className="flex-1">
                {children}
            </div>
            {
                close && !title ? <button className="cursor-pointer" onClick={() => close()}>
                <XCircleIcon className="size-5 text-white" />
                    </button> : ''
            }
        </div>
    </div>
}