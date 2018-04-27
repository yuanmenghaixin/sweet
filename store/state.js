const browserLang =
        window.navigator.language || window.navigator.browserLanguage;
const language =
        window.localStorage.getItem('userLang') ||
        (browserLang.match(/\S*(?=-)/)[0] === 'zh' ? 'zh-CN' : 'en');

export default {
    language,
    locale: {}
};
