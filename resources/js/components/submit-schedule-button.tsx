import { SubmitScheduleButtonData } from '@/types';
import { ArrowLeftIcon, ClockArrowUp, LoaderCircleIcon, UploadCloudIcon } from 'lucide-react';
import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import DateTimePicker from './ui/date-time-picker';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuTrigger } from './ui/dropdown-menu';

type SubmitScheduleButtonProp = {
    onChange: (data: SubmitScheduleButtonData) => void;
    handleSubmit: () => void;
    defaultText?: string;
    value: SubmitScheduleButtonData;
    disabled?: boolean;
};

const SubmitScheduleButton = forwardRef(({ onChange, handleSubmit, value, defaultText = 'Post' }: SubmitScheduleButtonProp, ref: any) => {
    const [view, setView] = useState('now');
    const [open, setOpen] = useState(false);
    const [disable, setDisable] = useState(false);
    const [date, setDate] = useState(new Date());
    const onChangeRef = useRef(onChange);
    const handleSubmitRef = useRef(handleSubmit);
    const valueRef = useRef(value);

    useImperativeHandle(ref, () => ({
        enabled: () => setDisable(false),
        disabled: () => setDisable(true),
        reset: () => setView('now'),
    }));

    useLayoutEffect(() => {
        onChangeRef.current = onChange;
        handleSubmitRef.current = handleSubmit;
        valueRef.current = value;
    });

    const actions = [
        {
            type: 'now',
            description: 'Publish news right away.',
        },
        {
            type: 'schedule',
            description: 'Choose a specific time and date to publish news.',
        },
    ];

    useEffect(() => {
        setView(valueRef.current.type);
        updateData();
    }, []);

    useEffect(() => {
        updateData();
    }, [date]);

    const updateData = () => {
        if (view == 'action') return;

        let data: SubmitScheduleButtonData = {
            type: view,
            payload: view == 'schedule' ? date : '',
        };

        onChangeRef.current?.(data);
    };

    useEffect(() => {
        updateData();
    }, [view]);

    const updateAction = (type: string) => {
        if (type == 'now') {
            setOpen(false);
        } else {
            setOpen(true);
            updateData();
        }

        setView(type);
    };

    const handleView = () => {
        setOpen(true);
        setView('action');
    };

    const handleDateChange = (date: Date) => {
        setDate(date);
    };

    const submit = () => {
        handleSubmitRef.current?.();
    };

    return (
        <DropdownMenu open={open}>
            <DropdownMenuTrigger asChild>
                <div className="flex">
                    <Button
                        type="button"
                        className="disabled:bg-brand-gray flex cursor-pointer rounded-r-none bg-gray-500 transition-all delay-75"
                        onClick={() => handleView()}
                    >
                        {view == 'now' ? <UploadCloudIcon /> : <ClockArrowUp />}
                        <p className="uppercase">{view == 'schedule' ? date.toLocaleString() : view == 'now' ? view : 'Select action'}</p>
                    </Button>
                    <Button
                        type="button"
                        className="disabled:bg-brand-gray cursor-pointer rounded-l-none transition-all delay-75"
                        onClick={() => submit()}
                        disabled={disable}
                    >
                        {disable && <LoaderCircleIcon className="size-5 animate-spin" />}
                        {defaultText}
                    </Button>
                </div>
            </DropdownMenuTrigger>

            <DropdownMenuPortal>
                <DropdownMenuContent sideOffset={5} className="p-0">
                    <DropdownMenuItem className="hover:bg-white">
                        {view == 'schedule' ? (
                            <div className="flex flex-col">
                                <div className="flex-1">
                                    <DateTimePicker value={date} onChange={(date) => handleDateChange(date)} />
                                </div>
                                <div className="flex h-20 items-center justify-between border-t border-t-gray-200">
                                    <button
                                        className="text flex flex-1 cursor-pointer items-center gap-x-2 rounded-sm p-2"
                                        onClick={() => updateAction('action')}
                                    >
                                        <ArrowLeftIcon className="text-sm font-bold" />
                                        <p className="text-sm font-bold">More posting actions</p>
                                    </button>
                                    <Button onClick={() => setOpen(false)}>DONE</Button>
                                </div>
                            </div>
                        ) : (
                            <div className="h-44">
                                {actions.map((item) => (
                                    <button
                                        className="text mb-5 flex w-full cursor-pointer flex-col items-start rounded-sm bg-gray-400 p-2 hover:bg-blue-900"
                                        key={item.type}
                                        onClick={() => updateAction(item.type)}
                                    >
                                        <p className="text-white capitalize">{item.type}</p>
                                        <p className="text-xs text-gray-200">{item.description}</p>
                                    </button>
                                ))}
                            </div>
                        )}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenuPortal>
        </DropdownMenu>
    );
});

SubmitScheduleButton.displayName = 'SubmitScheduleButton';

export default SubmitScheduleButton;
