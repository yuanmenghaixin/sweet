import Vue from 'vue';
import Countly from 'countly-sdk-web';

/**
 * Countly初始化
 * @param Vue vue对象
 * @param options countly初始化时的对象
 */
export default function(options = {}) {
    const {
        app_key,
        url,
        device_id,
        app_version,
        country_code,
        city,
        ip_address,
        debug,
        ignore_bots,
        interval,
        fail_timeout
    } = options
    Countly.init({
        app_key,
        url,
        device_id,
        app_version,
        country_code,
        city,
        ip_address,
        debug,
        ignore_bots,
        interval,
        fail_timeout
    })
    Vue.prototype.$Countly = Countly
}
