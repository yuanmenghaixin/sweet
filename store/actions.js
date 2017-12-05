import Vue from 'vue';
import VueI18n from 'vue-i18n';
import eleLocale from 'element-ui/lib/locale';

Vue.use(VueI18n);

export default {
    // 获取语言包
    getLang({ state }, lang) {
        lang = lang || state.language;
        return import ('@/locale/' + lang + '.json');
    },
    // 获取element语言包
    getEleLang({ state }, lang) {
        lang = lang || state.language;
        return import ('element-ui/lib/locale/lang/' + lang);
    },
    // 初始化语言
    initLang({ state, commit, dispatch }, lang) {
        lang = lang || state.language;
        const getInitLang = dispatch('getLang', lang);
        const getEleLang = dispatch('getEleLang', lang);

        return Promise.all([getInitLang, getEleLang])
            .then(([sysLang, eleLang]) => {
                return dispatch('mergeLang', { lang, sysLang, eleLang })
                    .then(() => {
                        const i18n = new VueI18n({
                            locale: lang,
                            fallbackLocale: 'zh-CN',
                            messages: state.locale
                        });

                        eleLocale.i18n((key, value) => i18n.t(key, value));

                        return i18n;
                    });
            });
    },
    // 切换语言
    updateLang({ state, commit, dispatch }, { lang, i18n }) {
        window.localStorage.setItem('userLang', lang);
        commit('SET_LANG', lang);

        const getSysLang = dispatch('getLang', lang);
        const getEleLang = dispatch('getEleLang', lang);

        return Promise.all([getSysLang, getEleLang])
            .then(([sysLang, eleLang]) => {
                return dispatch('mergeLang', { lang, sysLang, eleLang }).then(messages => {
                    i18n.locale = lang;
                    i18n.mergeLocaleMessage(lang, messages[lang]);
                });
            });
    },
    // 合并语言
    mergeLang({ state, commit, dispatch }, { lang, sysLang, eleLang }) {
        const messages = {};
        messages[lang] = sysLang;
        Object.assign(messages[lang], eleLang.default);
        commit('SET_LOCALE', Object.assign({}, state.locale, messages));

        return messages;
    }
};
