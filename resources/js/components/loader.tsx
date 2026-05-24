import { t } from 'i18next';

export default function Loader() {
    return (
        <div className="flex h-36 max-h-48 w-full animate-pulse items-center justify-center bg-gray-50">
            <p className="font-bold">{t('Please wait...')}</p>
        </div>
    );
}
