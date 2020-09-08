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
var crypto = require('crypto');

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
function createUserScheme(){
    UserScheme = mongoose.Schema({
        id: {type: String, required : true, unique :true,'default': ' '},
        hashed_password : {type: String,required: true,'default': ' '},
        salt: {type:String, required: true}, //암호화할 때 사용하는 값
        name: {type: String, index:'hashed','default': ' '},
        age: {type: Number, 'default':-1},
        created_at : {type:Date, index:{unique: false}, 'default':Date.now},
        updated_at : {type:Date, index:{unique: false}, 'default':Date.now}
    });
    UserScheme.virtual('password').set(function (password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
        console.log('virtual password 호출됨. '+this.hashed_password);
    }).get(function (){return this._password});

    //비밀번호 암호화 메소드
    UserScheme.method('encryptPassword',function (plainText, inSalt){
       if(inSalt){
           return crypto.createHmac('sha1',inSalt).update(plainText).digest('hex');
       } else {
           return crypto.createHmac('sha1',this.salt).update(plainText).digest('hex');
       }
    });
    UserScheme.method('makeSalt', function (){
       return Math.round((new Date().valueOf()*Math.random()))+'';
    });
    //암호화한 값이 서로 일치하는지 확인하는 것.
    UserScheme.method('authenticate', function (plainText, inSalt, hashed_password) {
        if(inSalt){
            return this.encryptPassword(plainText,inSalt) == hashed_password;
        } else {
            return this.encryptPassword(plainText) == hashed_password;
        }
    });
    //필수 속성에 대한 유효성 길이 확인(길이값 체크)
    UserScheme.path('id').validate(function (id){
        return id.length;
    }, 'id 칼럼 값이 없습니다.');
    UserScheme.path('name').validate(function (id){
        return id.length;
    }, 'name 칼럼 값이 없습니다.');

}
function connectDB(){
    var databaseurl = 'mongodb://localhost:27017/local'; //내가 가지고 있는 db url

    console.log("데이터베이스 연결을 시도함.");
    mongoose.Promise = global.Promise;
    mongoose.connect(databaseurl);
    database = mongoose.connection;
    database.on('error',console.error.bind(console, 'mongoose connection error.'));
    database.on('open',function (){
        console.log("데이터베이스에 연결되었습니다.");

        createUserScheme();
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
        if (results.length>0){
            console.log('아이디 비밀번호가 같은 사용자 찾음');
            var user = new UserModel({id: id});
            var authenticated = user.authenticate(password,results[0]._doc.salt, results[0]._doc.hashed_password);

            if(authenticated){
                console.log('비밀번호 일치함.');
                callback(null,results);
            } else {
                console.log('비밀번호 일치함.');
                callback(null,results);
            }
        }
    }
    )
}

var addUser = function (database, id, password,name, callback) {
    console.log("사용자 추가됨."+id);
    var user = new UserModel({"id":id,"password":password,"name":name});

    user.save(function (err) {
        if(err){
            callback(err,null);
            return;
        }
        callback(null,user);
        return;

    });
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