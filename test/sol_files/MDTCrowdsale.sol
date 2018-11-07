/*
 * @source: https://github.com/Arachnid/uscc/blob/master/submissions-2017/philipdaian/MDTCrowdsale.sol
 * @author: Philip Daian
 */

pragma solidity ^0.4.25;

import "./SafeMath.sol"; 

contract WhitelistedCrowdsale {
    using SafeMath for uint256;

    mapping (address => bool) public whitelist;

    function addToWhitelist(address addr) {
        require(msg.sender != address(this));
        whitelist[addr] = true;
    }

    // overriding Crowdsale#validPurchase to add extra whitelit logic
    // @return true if investors can buy at the moment
    function validPurchase() internal constant returns (bool) {
        return super.validPurchase() || (whitelist[msg.sender] && !hasEnded());
    }

}

contract MDTCrowdsale is WhitelistedCrowdsale {

    function MDTCrowdsale() 
    CappedCrowdsale(50000000000000000000000)
    Crowdsale(block.number, block.number + 100000, 1, msg.sender) { // Wallet is the contract creator, to whom funds will be sent
        addToWhitelist(msg.sender);
        addToWhitelist(0x0d5bda9db5dd36278c6a40683960ba58cac0149b);
        addToWhitelist(0x1b6ddc637c24305b354d7c337f9126f68aad4886);
    }
    
}
