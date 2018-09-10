pragma solidity ^0.4.15;

// Functions with all supported visibility modificators

contract DefaultVisibility {
    // Functions with default visibility must be identified by analyser 
    function defaultFunction() {}

    // Analyser must not trigger any issues for functions below
    function privateFunction() private {}

    function externalFunction() external {}

    function internalFunction() internal {}

    function publicFunction() public {}
}
