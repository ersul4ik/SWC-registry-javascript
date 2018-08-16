pragma solidity ^0.4.15;

contract Overflow {
    uint sellerBalance = 0;
    
   struct Proposal {
        uint voteCount;
    }
    
    uint x = 0;
    Proposal aaa = Proposal(1);

 

    function add(uint value) returns (bool){
        sellerBalance += value; // possible overflow

        uint lol = 10 - 1  -2;


        Proposal bbb = aaa;

        // possible auditor assert
        // assert(sellerBalance >= value); 
    } 

  ///  function safe_add(uint value) returns (bool){
    //    require(value + sellerBalance >= sellerBalance);
   //     sellerBalance += value; 
    //} 
}