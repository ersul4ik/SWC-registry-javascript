pragma solidity ^0.4.15;

contract Overflow {
    uint private sellerBalance=0;
    
    function add(uint value) returns (bool){
        sellerBalance += value; // possible overflow

        if(1==1){

        }

        uint lol = 1;
        lol -= 1 - 1  -2;

        // possible auditor assert
        // assert(sellerBalance >= value); 
    } 

    function safe_add(uint value) returns (bool){
        require(value + sellerBalance >= sellerBalance);
        sellerBalance += value; 
    } 
}