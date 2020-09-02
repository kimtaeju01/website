// 주소 문자열과 요청 파라미터 다루기
//url 모듈 설치
var url = require('url');

var culURL = url.parse('https://search.naver.com/search.naver?sm=top_sug.pre&fbm=1&acr=3&acq=steve+&qdt=0&ie=utf8&query=steve+jobs'); //url 주소를 객체로 변환

var curStr = url.format(culURL); // url 객체를 주소로 변환

var querystring = require('querystring');
var param = querystring.parse(culURL.query);

console.log('요청 파라미터 중 query 값: '+ param.query); //내가 steve jobs 라고 검색하면 query 값에는 steve jobs 라는 값이 담긴다. 즉, 내가 정보를 찾을 때 사용하는 값이라고 생각하면 된다.
console.log('원본 요청 파라미터:', querystring.stringify(param))