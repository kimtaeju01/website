var express = require('express');
var http = require('http');
var path = require('path');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var static = require('serve-static');
var errorHandler = require('errorhandler');

var expressErrorHandler = require('express-error-handler');

var expressSession = require('express-session');

var app = express();

app.set('port',process.env.PORT||3000);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(static(path.join(__dirname,'public')));

app.use(cookieParser());

app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized: true
}));

//몽고db 모듈 사용
var MongoClient = require('mongodb');

var database;
const options = {
    keepAlive: 1,
    useUnifiedTopology: true,
    useNewUrlParser: true,
}
function connectDB(){
    var databaseurl = 'mongodb://localhost:27017/local'; //내가 가지고 있는 db url

    MongoClient.connect(databaseurl, options,function (err,db) { //url 바탕으로 연결함.
        if (err) throw err;
        console.log("데이터베이스에 연결되었습니다.");
        database = db.db('local');
    });
}
var authUser = function (database, id, password, callback){ //callback 함수 반환값은 err와 docs이다.
    console.log('authUser 호출됨.');

    var users = database.collection('users');

    users.find({'id':id,'password':password}).toArray(function (err,docs) {
        if(err){
            callback(err,null);
            return;
        }
       if (docs.length > 0){
           console.log('아이디 비밀번호 일치하는 사용자 찾음');
           callback(null, docs);
       } else {
           callback(null,null);
       }
    });
}

var addUser = function (database, id, password,name, callback) {
    console.log("사용자 추가됨."+id);

    var users = database.collection('users');

    users.insertMany([{"id":id,"password":password,"name":name}], function (err,result){
       if(err){
           callback(err,null);
           return;
       }
       if(result.insertedCount>0){
           console.log("사용자 추가됨");
       }else{
           console.log("추가된 사용자 없음");
       }
       callback(null,result);
    });
}
var router = express.Router();

router.route('/process/login').post(function (req,res){
   console.log("process/login 이 실행됨.");
   var paramId = req.body.id;
   var paramPassword = req.body.password;

   if(database){
       authUser(database,paramId,paramPassword,function (err,docs){
           if(err) {throw err;}

           if(docs){
               console.dir(docs);
               var username = docs[0].name;
               res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
               res.write('<h1>로그인 성공</h1>')
               res.write(username);
               res.write('<a href="login.html">다시 로그인하기</a>');
               res.end();

           } else {
               res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
               res.write('<h1>로그인 실패</h1>');
               res.write('<a href="login.html">다시 로그인하기</a>');
               res.end();
           }
       });
   } else {
       res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
       res.write('<h3>데이터베이스 문제</h3>');
       res.end();
   }
});
router.route('/process/adduser').post(function (req,res){
    var paramId = req.body.id||req.query.id;
    var paramPassword = req.body.password||req.query.password;
    var paramName = req.body.name||req.query.name;
    var repassword = req.body.repassword||req.query.repassword;
    if(repassword != paramPassword){
        res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
        res.write("<h1>비밀번호 불일치!</h1>");
        res.end();
    }
    else {
        if(database){
        addUser(database,paramId, paramPassword, paramName,function (err,result){
            if (err) {throw err;}
            if(result && result.insertedCount > 0){
                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                res.write("추가 성공!");
                res.end();
            } else {
                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                res.write("추가 실패!");
                res.end();
            }
        });
    }
    }
})
app.use('/',router);

var errorHandler = expressErrorHandler({
    static:{
        '404':'./public/404.html'
    }
});
app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

http.createServer(app).listen(3000,function (){
    console.log('서버가 시작됨.');
    connectDB();
})