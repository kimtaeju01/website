//버퍼 사용법
//1. 크기 지정후 문자열 써서 출력
var output = "안녕 1!";
var buffer1 = Buffer.alloc(10); //버퍼 크기 할당하고
var len = buffer1.write(output, 'utf8'); // 버퍼에다가 안녕 1이라는 데이터를 넣는 과정
console.log('첫 번째 버퍼의 문자열: %s', buffer1.toString());

// 문자열을 이용해 바로 객체 만들기

var buffer2 = Buffer.from('안녕 2!');
console.log('buffer 2 출력: ',buffer2.toString());

