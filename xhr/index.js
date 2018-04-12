import Vue from 'vue';
import axios from 'axios';

const SWXHR = function(options, store, tool) {
    // 注册
    this._reg(store, tool);

    var that = this,
        deOptions = {
            config: {
                baseURL: '',
                timeout: 0,
                // 实时数据请求必须不能缓存
                headers: {'If-Modified-Since': '0'},
                maxStatus: 500,
                validateStatus: function(status) {
                    return that._catchStatus(status);
                }
            },
            intercept: {
                // 请求前
                request(p) {
                    return p;
                },
                // 请求后
                response(response) {
                    return response;
                }
            }
        };
    // this.OPTIONS = {
    //     config: Object.assign(deOptions.config, options.config),
    //     intercept: Object.assign(deOptions.intercept, options.intercept)
    // };
    this.OPTIONS = this.SWTOOL.object.extend(true, deOptions, options);
    // 注册全局message
    this.$message = Vue.prototype.$message;

    that.axios = axios.create(this.OPTIONS.config);
    // 添加请求拦截器
    that._setInterceptors();
};

// 要发起请求必须要创建一个红盒实例，操作里面的状态
class Axios_RedBox {
    constructor(options) {
        this.loading = false;
        this.auto = true;

        for (let name in options) {
            if (options.hasOwnProperty(name)) {
                this[name] = options[name];
            }
        }
    }

    switchLoading(bool) {
        this.loading = bool;
    }

    getAxios(type, options) {
        if (this.loading) return;
        else this.switchLoading(true);
        var ax = this.SWXHR._getAxios(type, options);
        ax.then(res => {
            if (this.auto) this.switchLoading(false);
        })
        return ax;
    }

    GET() {
        return this.getAxios('GET', arguments);
    }

    POST() {
        return this.getAxios('POST', arguments);
    }

    DELETE() {
        return this.getAxios('DELETE', arguments);
    }

    PUT() {
        return this.getAxios('PUT', arguments);
    }
}

SWXHR.prototype = {
    _reg(store, tool) {
        Vue.prototype.SWXHR = this;
        // 注册工具类
        if (tool) {
            this.SWTOOL = tool.SWTOOL;
        }
        if (store) {
            store.SWXHR = this;
            store.SWTOOL = this.SWTOOL;
        }
    },
    _setInterceptors() {
        var intercept = this.OPTIONS.intercept,
            request = intercept.request,
            response = intercept.response,
            defaultError = function(error) {
                // 对请求错误做些什么
                return Promise.reject(error);
            };

        if (request && typeof(request) === 'function') this.axios.interceptors.request.use(request, defaultError);

        if (response && typeof(response) === 'function') this.axios.interceptors.response.use(response, defaultError);
    },
    _statusCode(statusCode) {
        var codes = {
            400: {
                text: '<p>错误编码：400</p>'
            },
            401: {
                text: '对不起，您没有权限，请重新登录后再打开。<p>错误编码：401</p>'
            },
            403: {
                text: '<p>错误编码：403</p>'
            },
            404: {
                text: '<p>对不起，没有找到页面或者数据</p><p>错误编码：404</p>'
            },
            409: {
                text: '对不起，资源冲突<p>错误编码：409</p>'
            },
            500: {
                text: '<p>错误编码：500</p>'
            },
            503: {
                text: '<p>错误编码：503</p>'
            }
        };

        if (codes[statusCode]) {
            // 托管给使用者调用
            if (typeof(this.OPTIONS.catchStatus) === 'function') {
                this.OPTIONS.catchStatus(statusCode, codes[statusCode]);
            } else {
                this.$message({
                    message: '状态码:' + statusCode + '，信息:' + codes[statusCode].text,
                    type: 'error'
                });
            }
        }
    },
    _catchStatus(status) {
        this._statusCode(status);
        return status < this.OPTIONS.config.maxStatus;
    },
    _getError(error) {
        if (error.response) {
            // 请求已发出，但服务器响应的状态码不在 2xx 范围内
            console.log('请求已发出');
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
    },
    _getAxios(type, args) {
        var url = args[0],
            data = args[1] ? args[1] : {};
        if (!url) return;
        return this.axios[type.toLowerCase()](url, data);
    },
    create(options) {
        return new Axios_RedBox(Object.assign(options, { SWXHR: this }));
    },
    GET() {
        return this._getAxios('GET', arguments);
    },
    POST() {
        return this._getAxios('POST', arguments);
    },
    DELETE() {
        return this._getAxios('DELETE', arguments);
    },
    PUT() {
        return this._getAxios('PUT', arguments);
    },
    ALL() {
        return this.axios.all(arguments);
    },
    SPREAD() {
        return this.axios.spread(arguments);
    }
};

export default SWXHR;
