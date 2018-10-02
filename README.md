[![Waffle.io - Columns and their card count](https://badge.waffle.io/b9e80431029c41302ed88254bb7b9633.svg?columns=all)](https://waffle.io/thec00n/maru)

# Maru 

A simple static code analyzer for Solidity smart contracts. 

### Table of Contents

- [Installation](#installation)
- [NPM commands](#npm-commands)
- [Usage](#usage)

## Installation

* Checkout submodule
  - `git submodule init`
  - `git submodule update --remote`
* Install dependencies. Select one of the commands below based on required build type
  - `npm run build:prod` Production build
  - `npm run build:dev` Development build

## NPM commands

* `npm run dev` Run tsc in watch mode.
* `npm run build:prod` Production build. Uses latest version of [solidity-parser-antlr](https://github.com/thec00n/solidity-parser-antlr)
* `npm run build:dev` Development build. Builds [solidity-parser-antlr](https://github.com/thec00n/solidity-parser-antlr) from source (`master` branch)
* `npm run test:unit` Run unittests and print coverage
* `npm run test:functional` Run functional tests and print coverage
* `npm test` Run both unit and functional tests
* `npm run lint` Linter check
* `npm run updateswc` will rum update_swc.ts and generate the swc entries json, and will run `tsc` to update dist code.

## Usage
<i>If package is installed globally `maru` executable is available globally as well</i>

```console
  -v, --version         Print current version
  -r, --run directory   Analyse files in specified directory
  -h, --help            Print this help message
```


