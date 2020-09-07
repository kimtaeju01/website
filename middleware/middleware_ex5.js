//cookie 연습
var express = require('express');
var http = require('http');
var path = require('path');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var bodyParser = require('body-parser');
var static = require('serve-static');

var app = express();

app.set('port', process.env.PORT||3000);

app.use(bodyParser.urlencoded({extended:false}));

app.use(bodyParser.json());

app.use(static(path.join(__dirname,'public')));
app.use(cookieParser());
app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized:true
}));

var router = express.Router();

router.route('/process/product').get(function (req,res) {
   console.log("/process/product 호출됨.");

   if(req.session.user){
       res.redirect('/product.html');
   } else {
       res.redirect('/login2.html');
   }
});
//로그인 과정, 세션 값을 담는다.
router.route('/process/login').post(function (req,res) {
   var paramId = req.body.id || req.query.id;
   var paramPassword = req.body.password || req.query.password;

   if (req.session.user){
       console.log('이미 로그인된 상태입니다.');
       res.redirect('/product.html');
   } else{
       req.session.user = {
           id: paramId,
           name:'소녀시대',
           rejectUnauthorized: true
       };
   }
   res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
   res.write('<h1>로그인 성공</h1>');
   res.write('<p>'+paramId+ '</p>');
   res.write('<p>'+paramPassword+ '</p>');
   res.write("<a href='/process/product'>상품 조회</a>");
   res.end();
});
router.route('/process/logout').get(function (req,res) {
   if(req.session.user){
       console.log('로그아웃합니다.');
       req.session.destroy(function (err) {
          if(err) {throw err;}
          res.redirect('/login2.html');
       });
   } else {
       console.log('아직 로그인되지 않았습니다.');
       res.redirect('/login2.html');
   }
});

app.use('/',router);

http.createServer(app).listen(3000,function(){
    console.log("서버 시작됨.");
})