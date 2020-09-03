//stram 사용법

var fs = require('fs');

var infile = fs.createReadStream('./output2.txt',{flags: 'r'});
var outfile = fs.createWriteStream('./output4.txt',{flags:'w'});

infile.on('data',function (data){ //이 때 파일을 읽음
    console.log('읽어 들인 데이터',data);
    outfile.write(data); //이 때 데이터를 씀
});
//사실 이때 모든 과정이 끝났지만 뒤에 있는 코드는 파일 읽기 및 쓰기가 종료되었음을 보여준다.

/*
infile.on('end',function (){
    console.log('파일 읽기 쓰기 종료');
    outfile.end(function (){
        console.log('파일 쓰기 종료');
    });
});
 */