//콜백 함수 이해하기
/*
function add (a,b,callback){
    var result = a+b;
    callback(result);
}

add(10,10,function (result){
  console.log("콜백 함수 호출됨");
  console.log(result);
}); */

function add(a,b,callback){
    var result = a+b;

    var count = 0;
    var history = function() {
        count++;
        return count+":"+a + '+' + b + '=' + result; //이 값이 add_history()의 return 값이 된다.
    }
    callback(result);
    return history;
}

var add_history = add(10,10,function (result){ //이때 callback 함수는 실행이 되고
    console.log("콜백 함수 호출됨");
    console.log(result);
});
console.log("start")
console.log('결과 값으로 받은 함수 실행 결과 : '+add_history());