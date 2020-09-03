//우리가 직접 만든 이벤트 처리

process.on('tick', function (count){
    console.log('tick 이벤트 발생함 :',count);
});

setTimeout(function (){
    console.log('2초후에 시스템 종료 시도함');

    process.emit('tick','2'); //on에서 필요한 변수 전달.tick 라는 event를 2번 전달한다.

},2000);