// 계산기 객체를 모듈로 만들어 보기
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var Calc = function (){
    var self = this;
    this.on('stop',function (){
        console.log('calc 객체에 stop 이벤트 전달됨.');
    });
};

util.inherits(Calc,EventEmitter); //이벤트를 내보낼 수 있음.

Calc.prototype.add = function(a,b){
    return a+b;
}

module.exports = Calc;
module.exports.title = 'calculator';