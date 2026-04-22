import { format, setHours, setMinutes } from "date-fns";
import React, { type ChangeEventHandler, forwardRef, useEffect, useLayoutEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";

const DateTimePicker = forwardRef(({value, onChange, ...props}: {value: Date, onChange: (date: Date) => void}, ref: any) => {
    const valueRef = useRef<Date | null>(null)
    const onChangeRef = useRef(onChange)
    const [selected, setSelected] = useState<Date>();
    const [timeValue, setTimeValue] = useState<string>("00:00");

    useLayoutEffect(() => {
        valueRef.current = value
        onChangeRef.current = onChange
    })

    // Keep the time input in sync when the selected date changes elsewhere.
    useEffect(() => {
        if (selected) {
        setTimeValue(format(selected, "HH:mm"));
        }
    }, [selected]);

    useEffect(() => {
        if(valueRef.current) {
            setSelected(value)
        }
    }, [])

    const handleTimeChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        const time = e.target.value;
        if (!selected) {
        // Defer composing a full Date until a day is picked.
        setTimeValue(time);
        return;
        }
        const [hours, minutes] = time.split(":").map((str) => parseInt(str, 10));
        // Compose a new Date using the current day plus the chosen time.
        const newSelectedDate = setHours(setMinutes(selected, minutes), hours);
        setSelected(newSelectedDate);
        setTimeValue(time);
        onChangeRef.current?.(newSelectedDate)
    };

    const handleDaySelect = (date: Date | undefined) => {
        if (!timeValue || !date) {
        setSelected(date);
        return;
        }
        const [hours, minutes] = timeValue
        .split(":")
        .map((str) => parseInt(str, 10));
        // Apply the time value to the picked day.
        const newDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        hours,
        minutes,
        );

        onChangeRef.current?.(newDate)
        setSelected(newDate);
    };

    return (
        <div className="flex flex-col">
            <div className="flex-1">
                <DayPicker
                    mode="single"
                    selected={selected}
                    onSelect={handleDaySelect}
                    timeZone="Asia/Qatar"
                    
                />
            </div>
            <div className="border-t border-t-gray-200 py-2">
                <p className="font-bold mb-2">Select time</p>
                <input type="time" value={timeValue} onChange={handleTimeChange}  />
            </div>
        </div>
    );
})

DateTimePicker.displayName = 'DateTimePicker'

export default DateTimePicker