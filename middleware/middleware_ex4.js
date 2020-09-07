//cookie 연습
var express = require('express');
var http = require('http');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var static = require('serve-static');

var app = express();

app.set('port', process.env.PORT||3000);

app.use(bodyParser.urlencoded({extended:false}));

app.use(bodyParser.json());

app.use(static(path.join(__dirname,'public')));
app.use(cookieParser());
//url 파라미터 사용하기
var router = express.Router()

router.route('/process/showCookie').get(function (req,res) {
   console.log("showcookie 실행됨");
   res.send(req.cookies);
});

router.route('/process/setUserCookie').get(function (req,res) {
   console.log("setUserCookie 실행됨.");
   //쿠키 설정
    res.cookie('user',{
        id: "mike",
        name: '소녀시대',
        age: 20
    });

    res.redirect('/process/showCookie');
});
app.use('/',router);

http.createServer(app).listen(3000,function(){
    console.log("서버 시작됨.");
})