[![CircleCI](https://circleci.com/gh/ConsenSys/maru.svg?style=svg&circle-token=842b09eb6f78f1b2c42b18e3e7d354d2264de3ae)](https://circleci.com/gh/ConsenSys/maru)
[![Waffle.io - Columns and their card count](https://badge.waffle.io/956b8618278f3538b8f18df0889d29ec.svg?columns=all)](https://waffle.io/ConsenSys/maru)

# Maru 


<img height="170px" Hspace="0" Vspace="0" align="right" src="static/maru.png"/> 

A static code analyzer for Solidity smart contracts. 

Installation:
* Install dependencies: `npm install` 
* Create a production build: `npm run build:prod` 
* Link `npm link` or install Maru globally `npm -g install`

    
## Usage

Running Maru on a file or directory with `--run` will run all active plugins:

```
./maru --run test/SWC-registry/test_cases/

./maru --run test/SWC-registry/test_cases/uninitialised_storage_pointer/crypto_roulette.sol 
```

Run Maru with `--plugin` to run specific plugins (find the list [here](https://github.com/thec00n/maru/blob/master/config/config.json)). 

```
./maru --run test/SWC-registry/test_cases/uninitialised_storage_pointer/crypto_roulette.sol --plugin OutdatedCompilerVersion
```

Define logging level for maru:
```
DEBUG_LEVEL=info ./maru --run test/SWC-registry/test_cases/uninitialised_storage_pointer/crypto_roulette.sol

```

## Dev Setup
* Install dependencies: `npm install` 
* Checkout submodule
  - `git submodule init`
  - `git submodule update --remote`
* Create a development build (if you want to extend [solidity-parser-antlr](https://github.com/thec00n/solidity-parser-antlr)): `npm run build:dev` 

## Run maru with SWC test cases 

Run the following the command `npm run test:swc` to see which test samples Maru detects. This requires a dev build. 

## Credits 
Maru uses the excellent 3rd party Solidity grammar in [solidity-antlr4](https://github.com/solidityj/solidity-antlr4) and AST abstraction in [solidity-parser-antlr](https://github.com/thec00n/solidity-parser-antlr) from @federicobond. 
