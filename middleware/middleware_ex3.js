var express = require('express');
var http = require('http');
var path = require('path');

var bodyParser = require('body-parser');
var static = require('serve-static');

var app = express();

app.set('port', process.env.PORT||3000);

app.use(bodyParser.urlencoded({extended:false}));

app.use(bodyParser.json());

app.use(static(path.join(__dirname,'public')));
//url 파라미터 사용하기
var router = express.Router()

router.route('/process/login/:name').post(function (req,res) {
    console.log("처리함");
   var paramName = req.params.name; //url에 정보가 담긴 것이다.

   var paramId = req.body.id || req.query.id;
   var paramPassword = req.body.password || req.query.password;

   res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
   res.write('<p>'+paramName+'</p>');
   res.write('<p>'+paramId+'</p>');
   res.write('<p>'+paramPassword+'</p>');
   res.end();
});
//오류 핸들러 다루기
var expressErrorHandler = require('express-error-handler');
var errorHandler = expressErrorHandler({
    static:{
        '404':'./public/404.html'
    }
});
app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);
app.use('/',router);

http.createServer(app).listen(3000,function(){
    console.log("서버 시작됨.");
})