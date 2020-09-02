// 이벤트 리스너 사용법
process.on('exit', function(){ //exit 이라는 이벤트가 발생하면 listener를 실행시키는 것이다.
    console.log('exit 이벤트 발생함');
    });

setTimeout(function (){
    console.log('2초 후에 이벤트 종료 시도함');
    process.exit();
},2000);