var express = require('express');
var http = require('http');

var app = express();

app.use(function(req,res,next){ //미들웨어 등록함.
    console.log("첫 번째 미들웨어에서 요청 처리함");
    req.user = 'mike';
    next();
});
app.use('/',function(req,res,next){
    console.log("두 번째 미들웨어에서 요청 처리함");
    res.writeHead('200',{'Content-Type':'text/html;charset=utf-8'});
    res.end('<h1>express에서'+ req.user+"응답한 결과입니다.</h1>");
});

http.createServer(app).listen(3001,function (){
    console.log('express 서버가 3001으로부터 시작됨.');
});