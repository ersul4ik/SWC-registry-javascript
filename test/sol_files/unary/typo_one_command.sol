pragma solidity ^0.4.25;

contract TypoOneCommand {
    uint numberOne = 1;

    function alwaysOne() public {
        numberOne =+ 1337 + 2; 
        uint z = 1; alwaysTwo();

    }


    function alwaysTwo() public {
        numberOne =+ 2;
    }
}