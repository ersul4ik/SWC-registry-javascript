console.log(JSON.parse(solc.compile(JSON.stringify({
    language: 'Solidity',
    sources: {
        'lottery.sol': {
            content: source,
        },
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['evm', 'bytecode'],
            },
        },
    },
})))