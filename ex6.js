//외장 모듈 사용
var nconf = require('nconf');
nconf.env();

console.log('os 환경 변수 값:',nconf.get('OS'));