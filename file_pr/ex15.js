var fs = require('fs');

// 파일에서 데이터를 읽어 드립니다.
/*
fs.open('./output2.txt','w',function (err,fd){
   if(err) throw err;
   var buf = Buffer.from("안녕!\n"); //buffer: 데이터가 처리될 수 있도록 저장해놓는 장소
   fs.write(fd,buf,0,buf.length, null, function (err,written,buffer) {
       if(err) throw err;
       console.log(err,written,buffer);
       fs.close(fd,function (){
           console.log('파일 열고 데이터 쓰고 파일 닫기 완료.');
       });
   });
});
*/

// 파일에서 데이터를 읽어 드립니다.

fs.open('./output2.txt','r', function (err,fd){
   if(err) throw err;

   var buf = Buffer.alloc(10);
   console.log('버퍼 타입: %s',Buffer.isBuffer(buf)); // 버퍼 타입 확인
   fs.read(fd,buf,0,buf.length,null, function (err,bytesRead,buffer){
      if(err) throw err;

      var inStr = buffer.toString('utf8',0,bytesRead);

      console.log('파일에서 읽은 데이터: ',inStr);

      fs.close(fd,function (){
          console.log('파일 읽기 완료!');
      });
   });
});