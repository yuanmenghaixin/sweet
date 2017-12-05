/*
 * =====================================
 * name    : SWTOOL
 * version : v1.0.0
 * time    : 2017-12-05 10:20:24
 * auth    : huyingjun
 * e-mail  : yingjun.hu@geely.com
 * =====================================
 */

// sweet前端工具类库
const SWTOOL = {
    // 对象处理
    object: (function() {
        var copyIsArray,
            toString = Object.prototype.toString,
            hasOwn = Object.prototype.hasOwnProperty,
            class2type = {
                '[object Boolean]': 'boolean',
                '[object Number]': 'number',
                '[object String]': 'string',
                '[object Function]': 'function',
                '[object Array]': 'array',
                '[object Date]': 'date',
                '[object RegExp]': 'regExp',
                '[object Object]': 'object'
            },

            type = function(obj) {
                return obj == null ? String(obj) : class2type[toString.call(obj)] || 'object';
            },

            isWindow = function(obj) {
                return obj && typeof obj === 'object' && 'setInterval' in obj;
            },

            isArray = Array.isArray || function(obj) {
                return type(obj) === 'array';
            },

            isPlainObject = function(obj) {
                if (!obj || type(obj) !== 'object' || obj.nodeType || isWindow(obj)) {
                    return false;
                }

                if (obj.constructor && !hasOwn.call(obj, 'constructor') &&
                    !hasOwn.call(obj.constructor.prototype, 'isPrototypeOf')) {
                    return false;
                }

                var key;
                for (key in obj) {}

                return key === undefined || hasOwn.call(obj, key);
            },

            extend = function(deep, target, options) {
                for (var name in options) {
                    var src = target[name];
                    var copy = options[name];
                    var clone;

                    if (target === copy) { continue; }

                    if (deep && copy &&
                        (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && isArray(src) ? src : [];
                        } else {
                            clone = src && isPlainObject(src) ? src : {};
                        }

                        target[name] = extend(deep, clone, copy);
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }

                return target;
            };
        return { extend: extend };
    })(),
    // URL处理
    GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    },
    // 字符串消除前后空格
    removeSpace(string) {
        if (string) string = string.replace(/(^\s+)|(\s+$)/g, '');
        return string;
    }
}

// 针对Vue进行安装
const install = function(Vue, opts = {}) {
    console.log(1);
    if (install.installed) return;
    Vue.prototype.SWTOOL = SWTOOL;
}
/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
};

export default {
    install,
    SWTOOL
}
