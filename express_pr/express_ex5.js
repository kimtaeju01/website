var express = require('express');
var http = require('http');

var app = express();

app.use(function(req,res,next){ //req는 클라이언트에서 서버로 데이터를 보내는 것이다.
    console.log("첫 번째 미들웨어에서 요청 처리함");
    var userAgent = req.header('User-Agent');
    var paramName = req.query.name;
    res.writeHead('200',{'Content-Type':'text/html;charset=utf-8'});
    res.write('<div><p>'+userAgent+'</p></div>');
    res.write('<div>'+paramName+'</div>');
    res.end();
});

http.createServer(app).listen(3001,function (){
    console.log('express 서버가 3001으로부터 시작됨.');
});