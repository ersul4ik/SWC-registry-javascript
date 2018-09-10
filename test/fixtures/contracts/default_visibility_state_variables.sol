pragma solidity ^0.4.15;

contract DefaultVisibilityStateVariables {
    // Default state visibility variables must be identified as an issue
    uint variable = 0;
    //  const state variable should not be reported as an issue
    uint constant constVar = 0;

    uint private privateVar = 0;

    uint public publicVar = 0;

    uint internal internalVar = 0;
}
