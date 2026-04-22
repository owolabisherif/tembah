import { ChevronDown } from 'lucide-react';
import { forwardRef } from 'react';
import Calendar from './svgs/calendar';

type DateInputProps = {
    className?: string;
    value?: string;
    onClick?: () => void;
};

const DateInput = forwardRef<HTMLButtonElement, DateInputProps>(({ value, onClick, className }, ref) => (
    <button type="button" className={className} onClick={onClick} ref={ref}>
        <Calendar className="size-5 text-blue-900" />
        <p className="text-xs">{value}</p>
        <ChevronDown className="size-4" />
    </button>
));

DateInput.displayName = 'DateInput';

export default DateInput;
