import { useTranslation } from 'react-i18next';

export default function useTranslate(text: string): string {
    const { t } = useTranslation();

    return t(text);
}
