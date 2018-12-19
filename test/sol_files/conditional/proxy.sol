pragma solidity ^0.4.24;

contract Proxy {

  address callee;
  address owner;
  uint x=0;

  modifier onlyOwner {
    require(msg.sender == owner);
    _;

  }


modifier doSomething {
    _;
    uint[] storage y;
    x++;
  }

  constructor() public {
    callee = address(0x0);
    owner = msg.sender;
  }

  function setCallee(address newCallee) public onlyOwner {
    callee = newCallee;
  }

  function forward(bytes _data) public {
    require(callee.delegatecall(_data));
    assert(callee.delegatecall(_data));
    if(1==1){
        callee.delegatecall(_data);
    }

    1==1 ? callee.delegatecall(_data) : callee.delegatecall();
  }

}