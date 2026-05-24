import { cn } from '@/lib/utils';
import { SvgType } from '@/types';

export default function Youtube({ classData }: SvgType) {
    return (
        <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28.35 28.35" className={cn('fill-current', classData)}>
            <path
                fillRule="evenodd"
                d="M22.5,10.91c0-1.34-1.09-2.43-2.43-2.43h-11.4c-1.34,0-2.43,1.09-2.43,2.43v6.52c0,1.34,1.09,2.43,2.43,2.43h11.4c1.34,0,2.43-1.09,2.43-2.43v-6.52ZM12.74,16.92v-6.12l4.64,3.06-4.64,3.06ZM12.74,16.92"
            />
        </svg>
    );
}
