import { PropsWithChildren } from 'react';
import { components } from 'react-select';

export default function SelectValue({ children, ...props }: PropsWithChildren<any>) {
    return (
        <components.SingleValue {...props} className="flex items-center gap-x-2 text-xs font-bold">
            <img src={props.data.imageUrl} alt="thumbnail" className="h-5 w-5 rounded-full border border-gray-300 object-contain" />
            {props.data.label}
        </components.SingleValue>
    );
}
