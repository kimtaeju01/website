var express = require('express');
var http = require('http');
var path = require('path');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var bodyParser = require('body-parser');
var static = require('serve-static');
var errorHandler = require('errorhandler');
var expressErrorHandler = require('express-error-handler');
var multer = require('multer');
var fs = require('fs');
var cors = require('cors');

var app = express();
app.set('port', process.env.PORT||3000);
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(static(path.join(__dirname,'public')));

var router = express.Router();

router.route('/save').post(function (req,res) {
   console.log('/process/save 실행됨.');
   var paramUser = req.body.user || req.query.user;
   var paramText = req.body.content || req.query.content;

   var user = "User:"+paramUser;
   var text = "Text:"+paramText;
   var date = "Date:"+Date.now();
   var data = user+'\n'+text+'\n'+date;
   var filename = './memos/'+paramUser+Date.now()+'.txt';
   console.log(filename);
   fs.writeFile(filename,data,'utf8',function (err) {
      console.log("complete");
   });
   res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
   fs.readFile('./public/back.html',null,function(err,data){
      if(err){
         res.status(404).send("<h1>error</h1>");
      } else {
         res.write(data);
         res.end();
      }
   });
});

app.use('/',router);

http.createServer(app).listen(3000,function (){
    console.log("서버 시작됨.");
})