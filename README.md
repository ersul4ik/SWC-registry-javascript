# Lightweight, fast and extensible static code analyzer for smart contracts

### Table of Contents

- [Installation](#installation)
- [NPM commands](#npm-commands)
- [Usage](#usage)
- [Continuous Integration](#continuous-integration)
- [Release](#release)

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

Example:
`node dist/maru.js --run test/fixtures/contracts` Check all solidity files in `test/fixtures/contracts` directory

## Project structure
```
  .
  ├── deps/           Dependency related files. Currently contains `solidity-parser-antlr` package when built for dev environment.
  ├── config/         Analyser configuration location
  ├── plugins/        Analyser plugins location
  ├── src/            Analyser main modules location
  ├── test/
      └── SWC-registry  SWC registry submodule location    
```

## Continuous Integration
CI/CD is set up with CircleCI 2.0. A commit to any branch will trigger testing of the commited code. Tag commit on any branch (with tags of form v0.1.2) will trigger testing, and, if successful, release of the updated package to the NPM registry.

## Release
For successful release to NPM you should bump the package version in the package.json. To do it conveniently you can use `npm version UPDATE_TYPE` command, where `UPDATE_TYPE` stays for one of patch/minor/major to bump up 2, 1, or 0 in a sample version number v0.1.2. This command will update package.json and package-lock.json, and create a new commit and tag in the checked-out Git branch.

Please set `NPM_TOKEN` CircleCI environment variable which should contain npm registry token. Otherwise, release job will fail.