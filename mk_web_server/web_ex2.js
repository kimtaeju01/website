// 클라이언트가 웹 서버에 요청할 때 발생하는 이벤트 처리하기
var http = require('http');

var server = http.createServer(); //http 객체를 만든 후에

var port = 3001;
server.listen(port, function(){
    console.log('웹 서버가 시작되었습니다.');
}); //포트를 설정해 서버를 대기시킴.

//클라이언트 연결 이벤트 처리
server.on('connection',function (socket) {
   var addr = socket.address();
   console.log("클라이언트가 접속했습니다.");
});
//클라이언트 요청 이벤트 처리
//브라우저에서 웹 사이트에 접속을 시도하면 클라이언트는 서버로 부터 특정 정보를 요청한다.
server.on('request',function (req,res) { //res가 응답이다.
   console.log('클라이언트 요청이 들어왔습니다.');
   res.writeHead(200, {'Content-Type':"text/html; charset=utf-8"}); //안에 넣을 것들 time 지정정   res.write("<h1>nodejs로부터의 응답 페이지<h1>");

   res.end(); //응답을 다 보냈다는 것을 뜻함.
   /*image 넣는 방법
    var filename = 'house.jpg';
    fs.readFile(filename, function(err,data){
    res.writeHead(200,{"Content-Type":"image/png"});
    res.write(data);
    res.end();
    });
    */
});