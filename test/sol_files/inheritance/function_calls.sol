contract A {
    function r() returns (uint){ return 1; }
    
    function buy() returns (uint){
        return r();
    }
}

contract C {
    function r() returns (uint){ return 2; }

}

contract B is A,C {
  //  function r() returns (uint){ return 3; }
}
