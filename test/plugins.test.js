const fs = require('fs');
const path = require('path');
const { strictEqual } = require('assert');

const Analyzer = require('../src/analyzer.js');
const Repository = require('../src/repository');

const CONTRACTS_LOCATION = 'test/fixtures/contracts';

/**
 * Helper function that executes Maroo analyser for a specified solidity file
 * with list of configured plugins
 * @param {String} contractTestFile Filename of solidity file located in
 *                                  fixtures/contract (by default) directory
 * @param {Object} plugins Plugins configuration object
 * @returns {Array} List of issues
 */
function executeAnalyzer(contractTestFile, plugins) {
  const repository = new Repository();
  const filename = path.join(CONTRACTS_LOCATION, contractTestFile);
  repository.addFile(filename, fs.readFileSync(filename).toString());

  return Analyzer.runAllPlugins(repository, {
    plugins,
  });
}

describe('Plugins', () => {
  describe('Default function visibility', () => {
    describe('in default_visibility.sol', () => {
      it('should find one default function visibility issue in line 7', () => {
        const issues = executeAnalyzer('default_visibility.sol', {
          DefaultVisibilityFunction: {
            active: 'true',
            type: 'Default function visibility',
          },
        });

        strictEqual(issues.length, 1);

        strictEqual(issues[0].contract, 'DefaultVisibility');
        strictEqual(issues[0].type, 'Default function visibility');
        strictEqual(issues[0].code.trim(), 'function defaultFunction() {}');
        strictEqual(issues[0].linenumber, 7);
      });
    });
  });

  describe('Default visibility state variables', () => {
    describe('in default_visibility_state_variables.sol', () => {
      it('should find one default visibility state variable issues on line 5', () => {
        const issues = executeAnalyzer('default_visibility_state_variables.sol', {
          DefaultVisibilityStateVariable: {
            active: 'true',
            type: 'Default visibility state variables',
          },
        });

        strictEqual(issues.length, 1);

        strictEqual(issues[0].contract, 'DefaultVisibilityStateVariables');
        strictEqual(issues[0].type, 'Default visibility state variables');
        strictEqual(issues[0].code.trim(), 'uint variable = 0;');
        strictEqual(issues[0].linenumber, 5);
      });
    });
  });

  describe('InsecureIntegerArithmetic', () => {
    describe('in int_overflow.sol', () => {
      it('should fine two integer overflow issue on line 8 and 13', () => {
        const issues = executeAnalyzer('int_overflow.sol', {
          InsecureIntegerArithmetic: {
            active: 'true',
            type: 'Insecure Integer Arithmetic',
          },
        });

        strictEqual(issues.length, 2);

        strictEqual(issues[0].contract, 'InsecureIntegerArithmetic');
        strictEqual(issues[0].type, 'Insecure Integer Arithmetic');
        strictEqual(issues[0].code.trim(), 'sellerBalance += value;');
        strictEqual(issues[0].linenumber, 8);

        strictEqual(issues[1].contract, 'InsecureIntegerArithmetic');
        strictEqual(issues[1].type, 'Insecure Integer Arithmetic');
        strictEqual(issues[1].code.trim(), 'sellerBalance = value + 10;');
        strictEqual(issues[1].linenumber, 13);
      });
    });
  });

  describe('LockPragma', () => {
    const plugin = {
      LockPragma: {
        active: 'true',
        type: 'Pragma is not locked',
      },
    };
    describe('in pragma_locked.sol', () => {
      it('should not find any issues', () => {
        const issues = executeAnalyzer('pragma_locked.sol', plugin);

        strictEqual(issues.length, 0);
      });
    });

    describe('in pragma_not_locked.sol', () => {
      it('should find one pragma not locked issue on line 1', () => {
        const issues = executeAnalyzer('pragma_not_locked.sol', plugin);

        strictEqual(issues.length, 1);

        strictEqual(issues[0].contract, 'PragmaNotLocked');
        strictEqual(issues[0].type, 'Pragma is not locked');
        strictEqual(issues[0].code.trim(), 'pragma solidity ^0.4.15;');
        strictEqual(issues[0].linenumber, 1);
      });
    });
  });

  describe('OutdatedCompilerVersion', () => {
    const plugin = {
      OutdatedCompilerVersion: {
        active: 'true',
        type: 'Outdated compiler version',
      },
    };
    describe('in up_to_date_compiler.sol', () => {
      it('should not report any issues', () => {
        const issues = executeAnalyzer('up_to_date_compiler.sol', plugin);

        strictEqual(issues.length, 0);
      });
    });

    describe('in outdated_compiler.sol', () => {
      it('should report outdated compiler issue on line 1', () => {
        const issues = executeAnalyzer('outdated_compiler.sol', plugin);

        strictEqual(issues.length, 1);

        strictEqual(issues[0].contract, 'OutdatedCompiler');
        strictEqual(issues[0].type, 'Outdated compiler version');
        strictEqual(issues[0].code.trim(), 'pragma solidity ^0.4.23;');
        strictEqual(issues[0].linenumber, 1);
      });
    });
  });

  describe('UndeclaredStoragePointer', () => {
    describe('in uninitialized_storage_pointer.sol', () => {
      it('should report one uninitialized storage pointer issue on line 10', () => {
        const issues = executeAnalyzer('uninitialized_storage_pointer.sol', {
          UndeclaredStoragePointer: {
            active: 'true',
            type: 'Uninitialised storage pointer',
          },
        });

        strictEqual(issues.length, 1);

        strictEqual(issues[0].contract, 'UninitializedStoragePointer');
        strictEqual(issues[0].type, 'Uninitialised storage pointer');
        strictEqual(issues[0].code.trim(), 'Contract value2;');
        strictEqual(issues[0].linenumber, 10);
      });
    });
  });
});
