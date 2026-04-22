import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

// const languageDetector = new LanguageDetector();
// languageDetector.addDetector(BrowserLangDetector);

const options = {
    order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
    lookupQuerystring: 'lang',
    lookupCookie: 'i18next',
    lookupLocalStorage: 'i18nextLng',
    lookupSessionStorage: 'i18nextLng',

    // cache user language
    caches: ['localStorage'],
    excludeCacheFor: ['cimode'],
    //cookieMinutes: 10,
    //cookieDomain: 'myDomain'
};

i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .use(Backend)
    .init({
        detection: options,
        returnObjects: true,
        fallbackLng: 'ar',
        debug: true,
        lng: localStorage.getItem('lang') ?? 'ar',
        backend: { loadPath: `/assets/locales/{{lng}}/{{ns}}.json?v=${new Date().getTime()}` },
    });
