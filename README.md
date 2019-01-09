[![CircleCI](https://circleci.com/gh/ConsenSys/maru.svg?style=svg&circle-token=842b09eb6f78f1b2c42b18e3e7d354d2264de3ae)](https://circleci.com/gh/ConsenSys/maru)
[![JIRA-Board](https://img.shields.io/badge/JIRA-Online-blue.svg)](https://diligence.atlassian.net/secure/RapidBoard.jspa?projectKey=MARU&useStoredSettings=true&rapidView=25)

# Maru

<img height="170px" Hspace="0" Vspace="0" align="right" src="static/maru.png"/>

A static code analyzer for Solidity smart contracts.

Installation:

-   Prerequisites: install recent version of `nodejs` 8.x or 10.x
-   Create a production build: `npm run build:prod`
-   Install Maru globally `npm -g install .`

## Usage

Running Maru on a file or directory with `--run` will run all active plugins:

```
maru --run test/SWC-registry/test_cases/

maru --run test/SWC-registry/test_cases/uninitialised_storage_pointer/crypto_roulette.sol
```

Run Maru with `--plugin` to run specific plugins (find the list [here](https://github.com/thec00n/maru/blob/master/config/config.json)).

```
maru --run test/SWC-registry/test_cases/uninitialised_storage_pointer/crypto_roulette.sol --plugin OutdatedCompilerVersion
```

Define logging level for maru:

```
DEBUG_LEVEL=info maru --run test/SWC-registry/test_cases/uninitialised_storage_pointer/crypto_roulette.sol

```

## Issues and Features

The Mytril team relies on [Jira](https://diligence.atlassian.net/secure/RapidBoard.jspa?rapidView=25&projectKey=MARU&view=planning&selectedIssue=MARU-79&epics=visible&selectedEpic=MARU-76) to track issues and keep track of new features for most of its projects. Therefore Github issues have been deactivated for the project.

## Contribute

The preferred IDE for developing Maru is [Visual Studio Code](https://code.visualstudio.com) and the Prettier code formatting plugin. The custom settings that should be used are as follows:

```
{
    "typescript.updateImportsOnFileMove.enabled": "always",
    "window.zoomLevel": 0,
    "editor.formatOnPaste": true,
    "editor.formatOnSave": true,
    "prettier.tabWidth": 4,
    "diffEditor.ignoreTrimWhitespace": false,
    "prettier.printWidth": 140,
    "javascript.updateImportsOnFileMove.enabled": "always"
}
```

The project also uses fairly strict compiler rules, for more information see [tsconfig.json](./tsconfig.json).

## Credits

Maru uses the excellent 3rd party Solidity grammar in [solidity-antlr4](https://github.com/solidityj/solidity-antlr4) and AST abstraction in [solidity-parser-antlr](https://github.com/thec00n/solidity-parser-antlr) from @federicobond.
