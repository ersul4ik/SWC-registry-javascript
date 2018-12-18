pragma solidity ^0.4.24;

contract TypoOneCommand {
    int numberOne = 1;

    function alwaysOne() public {
        numberOne =+ 1337 + 2; 
        uint z = 1; alwaysTwo();

    }


    function alwaysTwo() public {
        numberOne =- 2;
    }
}
