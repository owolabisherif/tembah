import { League } from '@/types/match';
import { PropsWithChildren } from 'react';

export default function News({ ...props }: PropsWithChildren<League>) {
    return (
        <>
            <h1>News</h1>
        </>
    );
}
