var express = require('express');
var http = require('http');

var app = express();

app.use(function(req,res,next){
    console.log("첫 번째 미들웨어에서 요청 처리함");
    //res.send({name:'김태주',age:20});//json 파일 전송
    //res.status(403).send("Forbidden"); //상태 코드 전송
    res.redirect('http://google.co.kr'); //주소 이동
});

http.createServer(app).listen(3001,function (){
    console.log('express 서버가 3001으로부터 시작됨.');
});