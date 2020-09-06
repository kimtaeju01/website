var express = require('express');
var http = require('http');
var path = require('path');

var bodyParser = require('body-parser');
var static = require('serve-static');

var app = express();

app.set('port', process.env.PORT||3000);
//body-parser을 사용하기 위한 설정코드라고 생각
app.use(bodyParser.urlencoded({extended:false}));// 이 코드를 실행하는 이유는 req에 body 속성을 추가해 쉽게 파라미터를 가져올 수 있다.
//application/json 파싱, json 파일을 가져올 수 있다.
app.use(bodyParser.json());
//public 경로 설정, public에 있는 파일을 사용할 수 있다.
app.use(static(path.join(__dirname,'public')));

app.use(function (req,res,next) {
   console.log("첫 번째 미들웨어 요청을 처리함.");

   var paramId = req.body.id || req.query.id; //post 형식인지 get 형식인지 판별하는 것.
   var paramPassword = req.body.password || req.query.password;
   res.writeHead('200', {'Content-Type':'text/html;charset=utf-8'});
   res.write('<p>ID:'+paramId+'</p>');
    res.write('<p>password:'+paramPassword+'</p>');
    res.end();
});
http.createServer(app).listen(3000,function (){
    console.log('express 서버가 3000으로부터 시작됨.');
});
//html에 있는 전송버튼을 누르면 post형식으로 서버에 값을 전달하게 된다.