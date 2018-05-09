const browserLang =
        window.navigator.language || window.navigator.browserLanguage,
        browserLangReal = browserLang.match(/\S*(?=-)/) ? browserLang.match(/\S*(?=-)/)[0] : browserLang;
const language =
        window.localStorage.getItem('userLang') ||
        (browserLangReal === 'zh' ? 'zh-CN' : 'en');

export default {
    language,
    locale: {}
};
