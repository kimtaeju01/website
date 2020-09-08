var mongodb = require('mongodb');
var mongoose = require('mongoose');

var database;
var UserScheme;
var UserModel;

function createUserSchema(){
    UserScheme = mongoose.Schema({
        id: {type: String, required : true, unique :true},
        name: {type: String, index:'hashed'},
        age: {type: Number, 'default':-1},
        created_at : {type:Date, index:{unique: false}, 'default':Date.now},
        updated_at : {type:Date, index:{unique: false}, 'default':Date.now}
    });
    UserScheme.virtual('info').set(function (info){
        var splitted = info.split(' ');
        this.id = splitted[0];
        this.name = splitted[1];
        console.log('virtual info 설정함.');
    }).get(function (){return this.id+' '+this.name});

    console.log('userschema 정의함.');
    UserModel = mongoose.model('user4',UserScheme);

}

function doTest() {
    var user = new UserModel({"info":'test01 소녀시대'});
    user.save(function (err){
        if (err) {throw err;}
        findAll();
    });
    console.log('info에 값을 할당함.');
}
function findAll(){
    UserModel.find({ },function (err,results){
        if (err) {throw err;}
        if(results){
            console.log('결과'+results[0]._doc.name);
        }
    })
}
function connectDB(){
    databaseurl = 'mongodb://localhost:27017/local';

    mongoose.connect(databaseurl);
    database = mongoose.connection;

    database.on('open',function () {
        createUserSchema();
        doTest();
    });
}

connectDB();