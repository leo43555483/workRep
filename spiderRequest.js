const _request_ = require('request');
let DEFAULT_OPT = {
    url: '',
    method: "GET",
    timeout: 2000,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36'
    }
}
module.exports = function(spider) {
    spider.prototype.request = function(param) {
        this.opt = {};
        if (!param) {
            this._error('need a url or option on first param')
            return
        }
        if (typeof(param) === "object" && !param.url) {
            this._error('luck of url');
            return
        }
        if (typeof(param) === "String") {
            this.opt['url'] = param;
        }

    }
}