import { isDate, isToday, isTomorrow, isYesterday, parse } from "date-fns";

const useDateInterpretation = (dt: string): string => {
    
    if(isToday(dt)) return "Today"
    if(isTomorrow(dt)) return 'Tomorrow';
    if(isYesterday(dt)) return 'Yesterday';
    return dt
}

export default useDateInterpretation