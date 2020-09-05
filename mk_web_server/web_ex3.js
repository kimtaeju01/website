

var http = require('http');
/* get 방식으로 요청할 때
var options = {
    host: 'www.google.com',
    port: 80,
    path: '/'
};

var req = http.get(options, function (res) { //get method는 다른 사이트에 요청을 보내고 응답을 받을 수 있게 한다.
   //응답 처리
    var resData = '';
    res.on('data', function (chunk) { //data를 받고 있는 상태에서 일어나는 콜백함수
       resData += chunk;
    });
    res.on('end',function (){
        console.log(resData);
    });
});
 */

//post 방식으로 요청할 때

var opts = {
  host: 'www.google.com',
  port: 80,
  method: 'POST',
  path:'/',
  headers: {}
};

var resData = '';
var req = http.request(opts, function(res){
    //응답처리
    res.on('data',function (chunk) {
       resData += chunk;
    });
    res.on('end',function(){
        console.log(resData);
    });
});

opts.headers['Content-Type'] = 'application/x-www-form-urlencoded';
req.data = "q=actor"; //구글 사이트에 요청할 때 필요한 파라미터들 설정하기
opts.headers['Content-Length'] = req.data.length;
req.on('error',function(err){
    console.log("오류 발생: ",err.message);
});
req.write(req.data); //요청 본문 데이터 작성
req.end();