import { cn } from '@/lib/utils';
import { SvgType } from '@/types';

export default function Telegram({ classData }: SvgType) {
    return (
        <svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28.35 28.35" className={cn('fill-current', classData)}>
            <path d="M20.91,8.72v.33l-2.6,10.98c-.12.53-.5.84-1.05.78-.54-.09-3.01-2.49-3.23-2.48l-2.33,1.73,1-3.48,4.82-5.11c.25-.3-.1-.73-.45-.65l-7.78,4.26c-.14.02-2.36-.95-2.63-1.1-.29-.16-.4-.3-.55-.6v-.39c.15-.34.33-.59.71-.71l12.97-4.26c.54-.13.97.18,1.12.69Z" />
            <path d="M14.73,13.12l-2.82,3c-.43,1.12-.58,2.44-.99,3.55-.03.09.02.11-.14.09l-.83-4.01,4.77-2.63Z" />
        </svg>
    );
}
