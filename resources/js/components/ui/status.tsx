import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";

export default function Status(props: {text: string, bgColor: string, tooltip?: string}) {
    return (
        <>
            {props.tooltip ? <TooltipProvider key={props.tooltip} delayDuration={0}><Tooltip>
                <TooltipTrigger>
                    <div className={cn(props.bgColor, 'w-fit px-1 py-0.5 rounded-sm shadow-sm flex justify-center items-center text-white font-bold text-xs cursor-pointer')}>
                        {props.text}
                    </div>
                </TooltipTrigger>
                <TooltipContent className="bg-black text-white rounded-sm px-1 mb-1 text-sm">
                    <p>{props.tooltip}</p>
                </TooltipContent>
            </Tooltip></TooltipProvider> : <div className={cn(props.bgColor, 'w-fit px-1 py-0.5 rounded-sm shadow-sm flex justify-center items-center text-white font-bold text-xs cursor-pointer')}>
                        {props.text}
                    </div>}
        </>
    )
}
