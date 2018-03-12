const browserLang =
        window.navigator.language || window.navigator.browserLanguage;
const language =
        window.localStorage.getItem('userLang') ||
        (browserLang.match(/\S*(?=-)/)[0] === 'en' ? 'en' : browserLang);

export default {
    language,
    locale: {}
};
