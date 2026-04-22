import { components } from 'react-select';

export default function SelectOption(props: any) {
    return (
        <components.Option {...props} className="!flex !items-start !gap-x-2 !text-xs !font-bold">
            <img src={props.data.imageUrl} alt="thumbnail" className="h-5 w-5 rounded-full border border-gray-200 object-cover" />
            {props.data.label}
        </components.Option>
    );
}
