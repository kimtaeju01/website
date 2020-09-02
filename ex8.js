// 프로토타입 객체 만들기

function Person(name, age){ //함수도 객체이기 때문에 클래스처럼 만들 수 있는 것이다.
    this.name = name;
    this.age = age
}

Person.prototype.walk = function(speed) {
    console.log("speed:"+speed);
}

var p1 = new Person("김태주",20);
var p2 = new Person("aa",21);