import { isDate, isToday, isTomorrow, isYesterday, parse } from "date-fns";
import { t } from "i18next";

const useDateInterpretation = (dt: string): string => {
    
    if(isToday(dt)) return t("Today")
    if(isTomorrow(dt)) return t('Tomorrow');
    if(isYesterday(dt)) return t('Yesterday');
    return dt
}

export default useDateInterpretation