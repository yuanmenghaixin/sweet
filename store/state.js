const language = window.localStorage.getItem('userLang') || (window.navigator.language || window.navigator.browserLanguage);

export default {
    language,
    locale: {}
};
