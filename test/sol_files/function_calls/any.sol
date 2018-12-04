contract ParentFunctionCalls {
    function addOne(uint x) returns(uint){
        return x+1;
    }

}

contract FunctionCalls is ParentFunctionCalls{
    function lol(){
        uint a = now;
        uint b = super.addOne(1);
        bytes32 c = block.blockhash(1);
        bytes32 d = blockhash(a);
        uint e = msg.value;
        address f = block.coinbase;

    }
}