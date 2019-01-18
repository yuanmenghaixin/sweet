import Vue from 'vue';
import Countly from 'countly-sdk-web';

/**
 * Countly初始化
 * @param options Countly初始化时的对象
 */
export default function(options = {}) {
    Countly.init(options);
    Vue.prototype.$Countly = Countly;
}
