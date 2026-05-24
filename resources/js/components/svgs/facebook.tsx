import { cn } from '@/lib/utils';
import { SvgType } from '@/types';

export default function Facebook({ classData }: SvgType) {
    return (
        <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28.35 28.35" className={cn('fill-current', classData)}>
            <path d="M17.84,14.18h-2.4v8.55h-3.55v-8.55h-1.69v-3.02h1.69v-1.95c0-1.4.66-3.59,3.59-3.59h2.63v2.94h-1.91c-.31,0-.75.16-.75.82v1.78h2.71l-.31,3.02ZM17.84,14.18" />
        </svg>
    );
}
