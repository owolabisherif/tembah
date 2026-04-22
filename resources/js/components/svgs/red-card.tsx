import { cn } from '@/lib/utils';

export default function RedCard({ className }: { className?: string }) {
    return <div className={cn('fill-current', className)}></div>;
}
