var express = require('express');
var http = require('http');

//익스프레스 객체 생성
var app = express();
//기본 포트를 app 객체로 설정
app.set('port',process.env.PORT||3001); //set은 속성을 설정하는 메소드다.
//express 서버 시작
http.createServer(app).listen(app.get('port'),function(){ //get으로 속성을 꺼내온다. 아직 응답을 하지 않은 이유는 어떠한 형태로 응답할지 결정하지 않았기 때문이다.
    console.log('익스프레스 서버를 시작했습니다 : ',app.get('port'));
});