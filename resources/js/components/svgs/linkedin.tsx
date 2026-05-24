import { cn } from '@/lib/utils';
import { SvgType } from '@/types';

export default function LinkedIn({ classData }: SvgType) {
    return (
        <svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28.35 28.35" className={cn('fill-current', classData)}>
            <path d="M21.23,13.85v5.21h-3.02v-4.86c0-1.22-.44-2.05-1.53-2.05-.84,0-1.33.56-1.55,1.11-.08.19-.1.46-.1.74v5.08h-3.02s.04-8.24,0-9.09h3.02v1.29s-.01.02-.02.03h.02v-.03c.4-.62,1.12-1.5,2.72-1.5,1.99,0,3.48,1.3,3.48,4.09h0ZM8.84,5.59c-1.03,0-1.71.68-1.71,1.57s.66,1.57,1.67,1.57h.02c1.05,0,1.71-.7,1.71-1.57-.02-.89-.66-1.57-1.69-1.57h0ZM7.31,19.06h3.02v-9.09h-3.02v9.09ZM7.31,19.06" />
        </svg>
    );
}
