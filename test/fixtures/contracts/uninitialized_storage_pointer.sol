pragma solidity ^0.4.15;

contract Contract {
}

contract UninitializedStoragePointer {
    Contract value;

    function func(uint value) returns (bool){
        Contract value2;
    }
}