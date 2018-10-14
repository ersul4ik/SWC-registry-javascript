[![CircleCI](https://circleci.com/gh/thec00n/maru/tree/master.svg?style=svg&circle-token=842b09eb6f78f1b2c42b18e3e7d354d2264de3ae)](https://circleci.com/gh/thec00n/maru/tree/master)
[![Waffle.io - Columns and their card count](https://badge.waffle.io/b9e80431029c41302ed88254bb7b9633.svg?columns=all)](https://waffle.io/thec00n/maru)

# Maru 

<img height="150px" Hspace="0" Vspace="0" align="right" src="static/maru.png"/> 

A static code analyzer for Solidity smart contracts. 


## Installation



### Prod
* Install dependencies 
  - `npm install` 
* Create a production build 
  - `npm run build:prod` 
* Link or install Maru globally 
  - `npm -g install`
  - `npm link`

### Dev
* Install dependencies 
  - `npm install` 
* Checkout submodule
  - `git submodule init`
  - `git submodule update --remote`
* Create a development build (if you want to extend [solidity-parser-antlr](https://github.com/thec00n/solidity-parser-antlr)) 
  - `npm run build:dev` 
    
## Usage

The following command line parameters are available:

```console
  -v, --version         Print current version                                                         
  -r, --run directory   Analyse files in specified directory                                          
  -o, --output string   output format, txt or json, default ouput format is txt                       
  -p, --plugin string   option to execute individual plugin, specified by plugin names given as       
                        comma-separated value of this argument, run all plugins if not given          
  -h, --help            Print this help message  
```

Running Maru on a file or directory with `--run` will run all active plugins:

```console

./maru --run test/SWC-registry/test_cases/

./maru --run test/SWC-registry/test_cases/uninitialised_storage_pointer/crypto_roulette.sol 

```

Run Maru with `--plugin` to run specific plugins (find the list [here](https://github.com/thec00n/maru/blob/master/config/config.json)). 

```console

./maru --run test/SWC-registry/test_cases/uninitialised_storage_pointer/crypto_roulette.sol --plugin OutdatedCompilerVersion

```

Define logging level for maru:
```console
DEBUG_LEVEL=info ./maru --run test/SWC-registry/test_cases/uninitialised_storage_pointer/crypto_roulette.sol

```

## Run maru with SWC test cases 

Run the following the command `npm run test:swc` to see which test samples Maru detects. 
