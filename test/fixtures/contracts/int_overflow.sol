pragma solidity ^0.4.15;

contract InsecureIntegerArithmetic {
    uint sellerBalance = 0;
    
    function add(uint value) {
        // possible overflow
        sellerBalance += value;
    }

    function add2(uint value) {
        // possible overflow
        sellerBalance = value + 10;
    }
}
