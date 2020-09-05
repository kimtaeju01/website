var http = require('http');

var server = http.createServer();

var port = 3000;
server.listen(port,function(){ //port 지정해서 웹 서버랑 클라이언트랑 교류할 수 있게 하고
   console.log('웹 서버가 시작되었습니다 : %d',port); //이때 이 함수는 callback 함수로 서버가 생성되면 실행됨.
});