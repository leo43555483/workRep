let request = require('request');
let urlencode = require('urlencode');
const fs = require('fs');
(()=>{
    let iurl = 'http://58.194.172.113/files/kejian/'+ urlencode('2Apabi教参类电子图书.ppt');
    console.log('url',iurl)
   let option = {
        url:iurl,
        method:"GET",
        headers:{
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36'
        }
    }
    request(option,function(err,res){
        console.log('code',res.statusCode)

    }).pipe(fs.createWriteStream('2Apabi教参类电子图书.ppt'));
})()

// http://58.194.172.113/files/kejian/2Apabi教参类电子图书.ppt