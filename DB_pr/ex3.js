var express = require('express');
var http = require('http');
var path = require('path');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var static = require('serve-static');
var errorHandler = require('errorhandler');

var expressErrorHandler = require('express-error-handler');

var expressSession = require('express-session');

var mongoose = require('mongoose');

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

var database;
var UserScheme;
var UserModel;
function connectDB(){
    var databaseurl = 'mongodb://localhost:27017/local'; //내가 가지고 있는 db url

    console.log("데이터베이스 연결을 시도함.");
    mongoose.Promise = global.Promise;
    mongoose.connect(databaseurl);
    database = mongoose.connection;
    database.on('error',console.error.bind(console, 'mongoose connection error.'));
    database.on('open',function (){
        console.log("데이터베이스에 연결되었습니다.");
        UserScheme = mongoose.Schema({
            id: {type: String, required : true, unique :true},
            password : {type: String,required: true},
            name: {type: String, index:'hashed'},
            age: {type: Number, 'default':-1},
            created_at : {type:Date, index:{unique: false}, 'default':Date.now},
            updated_at : {type:Date, index:{unique: false}, 'default':Date.now}
        });
        //모델 함수 지정, model를 지정하기 전에 미리 해야한다.
        UserScheme.static('findById',function (id,callback){
            return this.find({id:id},callback);
        });

        UserScheme.static('findAll', function (callback) {
            return this.find({ },callback);
        });
        UserModel = mongoose.model("users2",UserScheme);
        //연결이 끊어졌을 때 5초 후 재연결
        database.on('disconnected',function (){
            setInterval(connectDB, 5000);
        });
    });
}
var authUser = function (database, id, password, callback){ //callback 함수 반환값은 err와 docs이다.
    console.log('authUser 호출됨.');
    UserModel.findById(id,function (err,results){
      if(err){
          callback(err,null);
          return;
      }
      if(results.length>0){
          if(results[0]._doc.password==password){
              callback(null,results);// 아이디와 비밀번호가 일치하는 객체를 반환함.
          } else {
              callback(null,null);
          }
      } else {
          callback(null,null);
      }
    })
}

var addUser = function (database, id, password,name, callback) {
    console.log("사용자 추가됨."+id);
    var user = new UserModel({"id":id,"password":password,"name":name});

    user.save(function (err) {
        if(err){
            callback(err,null);
            return;
        } else {
            callback(null,user);
            return;
        }
    })
}
var router = express.Router();
router.route('/process/listuser').post(function (req,res) {
   console.log('사용자 리스트 가져오기');
   if(database){
       UserModel.findAll(function (err,results){ //static를 정의할 때는 scheme에 사용할 때는 model를 이용해야한다.
           if(err){
               res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
               res.write("error!");
               res.end();
               return;
           }
           if(results){
               res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
               res.write("<h2>사용자 조회</h2>");
               res.write("<div><ul>");
               console.dir(results)
               for (var i=0;i<results.length;i++){
                   res.write('<li> # id: '+results[i]._doc.id+', name: '+results[i]._doc.name+'</li>');
               }
               res.write("</ul></div>");
               res.end();
               return;
           } else {
               res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
               res.write("사용자 객체 없음!");
               res.end();
               return;
           }
       })
   }else{
       res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
       res.write("데이터베이스 조회 실패!");
       res.end();
   }
});
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