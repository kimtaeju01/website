var Calc = require('./ex12');

var calc = new Calc();
calc.emit('stop'); // 이벤트 실행함.
console.log(Calc.title+'에 이벤트 전달함.');