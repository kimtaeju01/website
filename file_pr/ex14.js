//비동기식 io로 파일 읽기

var fs = require('fs');

fs.readFile('./pr','utf-8',function(err,data){ //확장자가 txt일 때는 그냥 쓰면 된다
    console.log(data);
});

//비동기식으로 파일 쓰기

fs.writeFile('./output.txt','hello world',function (err){
   if (err){
       console.log("err는",err);
   }
});