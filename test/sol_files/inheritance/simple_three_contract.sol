pragma solidity ^0.4.15;

contract D {
  uint public u;
  function f() {
    u = 4;
  }
}

contract C {
  uint public u;
  function f() {
    u = 1;
  }
}

contract B is C {
  function f() {
    u = 2;
  }
}

contract A is B,D {
  function f() {  // will set u to 3
    u = 3;
  }
  function f1() { // will set u to 2
    super.f();
  }
  function f2() { // will set u to 2
    B.f();
  }
  function f3() { // will set u to 1
    C.f();
  }
}