//cookie 연습
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
//데이터 주고 받을 수 있게 설정하기
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(static(path.join(__dirname,'public')));
app.use(static(path.join(__dirname,'uploads')));
//쿠키와 세션 설정
app.use(cookieParser());
app.use(expressSession({
    secret:'my key',
    resave:true,
    saveUninitialized: true
}));
app.use(cors());

var storage = multer.diskStorage({
    destination: function (req, file, callback) { // 업로드한 파일이 저장될 폴더를 지정한다.
        callback(null, 'uploads')
    },
    filename: function(req,file,callback){ //업로드한 파일 이름 바꾸기
        callback(null,file.originalname+Date.now())
    }
});

var upload = multer({
    storage: storage,
    limits:{
        files:10,
        fileSize: 1024*1024*1024
    }
});

var router = express.Router();

router.route('/process/photo').post(upload.array('photo',1),function (req,res) {
   console.log('photo가 호출됨.');

   try{
       var files = req.files;
       console.dir('#===============업로드된 첫번째 파일 정보');
       console.dir(req.files[0]);
       console.dir("=====================================");

       var originalname='';
       var filename='';
       var mimetype='';
       var size = 0;
       if (Array.isArray(files)){
           console.log("배열에 들어가있는 파일 수:",files.length);

           for (var index=0;index<files.length;index++){
               originalname = files[index].originalname;
               filename = files[index].filename;
               mimetype = files[index].mimetype;
               size = files[index].size;
           }
       } else {
           console.log("파일 갯수: 1");
       }
       console.log("현재 정보: "+originalname+" "+filename);
       res.writeHead("200",{'Content-Type':'text/html;charset=utf8'});
       res.write("<h1>파일 업로드 성공</h1>");
       res.write("<p>원본 파일 이름"+originalname+"</p>");
       res.write("<p>저장 파일 이름"+filename+"</p>");
       res.end();
   } catch (err){
       console.dir(err.stack);
   }
});
app.use('/',router);
http.createServer(app).listen(3000,function(){
    console.log("서버 시작됨.");
})