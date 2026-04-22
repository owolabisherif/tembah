export default {
    name: 'BrowserLangDetector',

    lookup(options) {
        // options -> are passed in options
        return 'en';
    },

    cacheUserLanguage(lng, options) {
        console.log(lng);
        console.log(options);
        // options -> are passed in options
        // lng -> current language, will be called after init and on changeLanguage
        // store it
    },
};
