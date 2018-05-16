let fs = require('fs');
let path = require('path');
let decode = require('iconv-lite');
const target = () => {
    return new Promise((resolve, reject) => {
        let result = [];
        fs.readFile(path.join(__dirname, 'target.txt'), (err, data) => {
            if (err) {
                reject();
                console.log('err', err)
            }
            const content = decode.decode(data, 'gbk').toString();
            let arr = content.split('&&');
            for (let i = 0, len = arr.length; i < len; i++) {
                let obj = {};
                let key = arr[i].split('$')[0];
                let value = arr[i].split('$')[1];
                if (obj[key]) return
                obj['title'] = key;
                obj['url'] = value;
                result.push(obj);
            }
            resolve(result);
        })
    })
}
module.exports = target