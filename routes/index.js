var express = require('express');
var path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/wmdc', function (req, res, next) {
  const page = 'post_list.html';
  const tpath = "./public/view/";
  res.sendFile(page, {
    root: tpath,
    headers: {
      "Content-Type": "text/html;charset=utf-8"
    }
  })
});
router.get('/:page', function(req, res, next) {
  const page = req.params.page;
  const tpath = "./public/view/";
  res.sendFile(page,{
    root: tpath,
    headers: {
      "Content-Type": "text/html;charset=utf-8"
    }
  })
});
router.get('/:api/:type', handleApi);
router.post('/:api/:type', handleApi);
router.post('/getList',(req,res)=>{
  console.log('post')
  const mock = { "recordsFiltered": 2, "data": [["公文流转", "wm8b37c1547b91490d", "c17703a0dc044da98a20d731298fc3af", "公文流转a", "2018-05-24 15:19", "超级root", 1], ["API", "wm48566fd88ad34a71", "1b3a077abace45a182f3186793113c5a", "", "2018-07-19 09:37", "超级root", 2]], "draw": 1, "recordsTotal": 2 }
  res.json(200, mock);
})

function handleApi(req, res, next){
  const type = req.params.type;
  const page = req.params.api;
  const tpath = "./public/view/";
  let contentType;
  switch (type) {
    case 'html':
      contentType = "text/html;charset=utf-8";
      break;
    case 'json':
      contentType = "application/json;charset=utf-8";
      break;
  }
  res.sendFile(page, {
    root: tpath,
    headers: {
      "Content-Type": contentType
    }
  })
}
module.exports = router;
