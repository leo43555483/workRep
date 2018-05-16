const getTarget = require('./target.js');
let request = require('request');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const urlencode = require('urlencode');
class Spider extends Event {
    constructor(option) {
        super();
        this.option = {};
        if (option) {
            this.option = Object({}, option);
        }
        this.init();
    }
    init() {
        return (async() => {
            try {
                const result = await getTarget();
                this.ob();
                this._request(result);
            } catch (e) {
                console.err('获取数据失败', e);
            }
        })();
    }
    ob() {
        let handleDownLoad = this.handleDownLoad;
        this._on('downloaded', handleDownLoad);
    }
    handleDownLoad(result) {
        const customCb = this.option.cb;
        if (customCb) {
            customCb(result);
        } else {
            cb();
        }

        function cb(result) {
            if (result.success) {
                countS++;
                console.log('%d', countS, result.info, '----->')
                console.log('文件名', result.fn)
                console.log('title', result.titles)
                console.log('<------------------>')
            } else {
                countF++
                console.log('%d', countF, result.info)
                console.log('文件名', result.fn)
                console.log('title', result.titles)
                console.log('<------------------>')
            }
        }

    }
    _request(target) {
        this.getPage(target);
    }
    getPage(target) {
        target.map(this.initialRequest);
    }
    initialRequest(item) {
        let url = item.url;
        const title = item.title;
        url = this.hasHttp(url) ? url : 'http://' + url;
        this.getUrl(url, title).then(downLoad);

        function downLoad(info) {
            if (!info.success) {
                resolve(info);
            } else {
                const uri = info.fileUri;
                const fileName = info.file;
                const ti = info.ti;
                const downLoadUrl = `http://${this.url}${uri}${urlencode(fileName)}`;
                let option = {
                    url: downLoadUrl,
                    method: "GET",
                    timeout: 2000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36'
                    }
                }
                request(option, (err, res) => {
                    const emit = this._emit;
                    if (err) {
                        console.log('downLoad err', err)
                        emit('downloaded', {
                            success: false,
                            info: `${fileName}下载错误`,
                            titles: ti,
                            fn: fileName
                        })
                    }
                    if (res && res.statusCode === 200) {
                        emit('downloaded', {
                            success: true,
                            info: `${fileName}下载完成`,
                            titles: ti,
                            fn: fileName
                        });
                    } else {
                        emit('downloaded', {
                            success: false,
                            info: `${fileName}下载失败`,
                            titles: ti,
                            fn: fileName
                        });
                    }

                }).pipe(fs.createWriteStream(path.join(__dirname, 'doc', fileName)))
            }

        }
    }
    getUrl(url, title) {
        return new Promise((resolve, reject) => {
            request(url, function(err, res, body) {
                if (err || res.statusCode >= 400 || res.statusCode < 200) resolve({ success: false, info: err })
                if (body) {
                    let $ = cheerio.load(body);
                    let href = $("#cPhone").find('a').attr("href");
                    if (href) {
                        let temp = href.split('/');
                        const len = temp.length;
                        const fileName = temp[len - 1];
                        let uri = href.slice(href.indexOf('files'), (href.length - fileName.length));
                        console.log('uri', uri) //去除文件名部分
                        resolve({
                            success: true,
                            file: fileName,
                            fileUri: uri,
                            info: '已获取href',
                            ti: title
                        })
                    } else {
                        console.log('无href', url);
                        resolve({
                            success: false,
                            info: url + '无href',
                            ti: title
                        });
                    }
                }
            });
        })
    }
    hasHttp(item) {
        const reg = RegExp(/^(http|https):\/\//)
        return reg.test(item);
    }

    _error(info) {
        throw new Error(info);
    }
}


// function handleResult(result) {
//     let countS = 0;
//     let countF = 0;
//     result.forEach((item, index) => {
//         if (item.success) {
//             countS++;
//             console.log('%d', countS, item.info, '----->')
//             console.log('文件名', item.fn)
//             console.log('title', item.titles)
//             console.log('<------------------>')
//         } else {
//             countF++
//             console.log('%d', countF, item.info)
//             console.log('文件名', item.fn)
//             console.log('title', item.titles)
//             console.log('<------------------>')
//         }
//     })
// }

// function _request(arr) {
//     return new Promise((resolve, reject) => {
//         Promise.all(getPage(arr)).then((result) => {
//             resolve(result);
//         })
//     })
// }

// function getPage(arr) {
//     return arr.map(initialRequest);
// }

// function initialRequest(item) {
//     return new Promise((resolve) => {
//         let url = item.url;
//         const title = item.title;
//         url = hasHttp(url) ? url : 'http://' + url;
//         getUrl(url, title).then(downLoad);

//         function downLoad(info) {
//             if (!info.success) {
//                 resolve(info);
//             } else {
//                 const uri = info.fileUri;
//                 const fileName = info.file;
//                 const ti = info.ti;
//                 const downLoadUrl = `http://${currentIp}${uri}${urlencode(fileName)}`;
//                 let option = {
//                     url: downLoadUrl,
//                     method: "GET",
//                     timeout: 2000,
//                     headers: {
//                         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36'
//                     }
//                 }
//                 request(option, (err, res) => {
//                     if (err) {
//                         console.log('downLoad err', err)
//                         resolve({
//                             success: false,
//                             info: `${fileName}下载错误`,
//                             titles: ti,
//                             fn: fileName
//                         })
//                     }
//                     if (res && res.statusCode === 200) {
//                         resolve({
//                             success: true,
//                             info: `${fileName}下载完成`,
//                             titles: ti,
//                             fn: fileName
//                         });
//                     } else {
//                         resolve({
//                             success: false,
//                             info: `${fileName}下载失败`,
//                             titles: ti,
//                             fn: fileName
//                         });
//                     }

//                 }).pipe(fs.createWriteStream(path.join(__dirname, 'doc', fileName)))
//             }

//         }
//     });
// }

// function getUrl(url, title) {
//     return new Promise((resolve, reject) => {
//         request(url, function(err, res, body) {
//             if (err || res.statusCode >= 400 || res.statusCode < 200) resolve({ success: false, info: err })
//             if (body) {
//                 let $ = cheerio.load(body);
//                 let href = $("#cPhone").find('a').attr("href");
//                 if (href) {
//                     let temp = href.split('/');
//                     const len = temp.length;
//                     const fileName = temp[len - 1];
//                     let uri = href.slice(href.indexOf('files'), (href.length - fileName.length));
//                     console.log('uri', uri) //去除文件名部分
//                     resolve({
//                         success: true,
//                         file: fileName,
//                         fileUri: uri,
//                         info: '已获取href',
//                         ti: title
//                     })
//                 } else {
//                     console.log('无href', url);
//                     resolve({
//                         success: false,
//                         info: url + '无href',
//                         ti: title
//                     });
//                 }
//             }
//         });
//     })
// }

// function hasHttp(item) {
//     const reg = RegExp(/^(http|https):\/\//)
//     return reg.test(item);
// }
let opt = {};
opt.url = '58.194.172.113/';
new Spider()