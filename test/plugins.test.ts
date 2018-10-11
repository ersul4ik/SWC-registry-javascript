const path = require("path");
const { strictEqual } = require("assert");

import Analyzer from "../src/analyzer";
import Repository from "../src/repository";

const CONTRACTS_LOCATION = "test/SWC-registry/test_cases";

/**
 * Helper function that executes Maru analyser for a specified solidity file
 * with list of configured plugins
 * @param {String} contractTestFile Filename of solidity file located in
 *                                  SWC-registry/contract (by default) directory
 * @param {Object} plugins Plugins configuration object
 * @returns {Array} List of issues
 */
function executeAnalyzer(contractTestFile: string, plugins: any) {
  const repository = new Repository();
  const filename = path.join(CONTRACTS_LOCATION, contractTestFile);
  repository.addFile(filename);

  return Analyzer.runAllPlugins(repository, { plugins });
}

describe("Plugins", () => {
  describe("Default function visibility", () => {
    describe("in default_visibility.sol", () => {
      it("should find one default function visibility issue in right line", () => {
        const issues = executeAnalyzer("default_visibility_functions/visibility_not_set.sol", {
          DefaultVisibilityFunction: {
            active: "true",
            type: "Default function visibility",
          },
        });

        strictEqual(issues.length, 2);
        strictEqual(issues[0].contract, "HashForEther");
        strictEqual(issues[0].code.trim(), "function withdrawWinnings() {      " +
          "  // Winner if the last 8 hex characters of t" +
          "he address are 0.         require(uint32(msg.sender) == 0);        _sendWinnings" +
          "();     }");
        strictEqual(issues[0].issuePointer.linenumber_start, 10);
        strictEqual(issues[0].issuePointer.linenumber_end, 14);
      });
    });
  });
});

describe("Default visibility state variables", () => {
  describe("in default_visibility_state_variables.sol", () => {
    it("should find one default visibility state variable issues on right line", () => {
      const issues = executeAnalyzer("default_visibility_variables/storage.sol", {
        DefaultVisibilityStateVariable: {
          active: "true",
          type: "Default visibility state variables",
        },
      });

      strictEqual(issues.length, 6);
      strictEqual(issues[0].contract, "TestStorage");
      strictEqual(issues[0].code.trim(), "uint storeduint1 = 15;");
      strictEqual(issues[0].issuePointer.linenumber_start, 5);
    });
  });
});

describe("InsecureIntegerArithmetic", () => {
  describe("in int_overflow.sol", () => {
    it("should fine two integer overflow issue on line 8 and 13", () => {
      const issues = executeAnalyzer("integer_overflow_and_underflow/integer_overflow_multitx_multifunc_feasible.sol", {
        InsecureIntegerArithmetic: {
          active: "true",
          type: "Insecure Integer Arithmetic",
        },
      });

      strictEqual(issues.length, 1);
      strictEqual(issues[0].contract, "IntegerOverflowMultiTxMultiFuncFeasible");
      strictEqual(issues[0].code.trim(), "count -= input;");
      strictEqual(issues[0].issuePointer.linenumber_start, 24);
      strictEqual(issues[0].issuePointer.linenumber_end, 24);

    });
  });
});

describe("LockPragma", () => {
  const plugin = {
    LockPragma: {
      active: "true",
      type: "Pragma is not locked",
    },
  };
  describe("in pragma_not_locked.sol", () => {
    it("should find one pragma not locked issue on line 1", () => {
      const issues = executeAnalyzer("pragma_not_locked/floating_pragma.sol", plugin);
      strictEqual(issues.length, 1);
    });
  });
});

describe("OutdatedCompilerVersion", () => {
  const plugin = {
    OutdatedCompilerVersion: {
      active: "true",
      type: "Outdated compiler version",
    },
  };

  describe("in outdated_compiler.sol", () => {
    it("should report outdated compiler issue on line 1", () => {
      const issues = executeAnalyzer("outdated_compiler_version/version_0_4_0.sol", plugin);

      strictEqual(issues.length, 1);
      strictEqual(issues[0].contract, "OutdatedCompilerVersion");
      strictEqual(issues[0].code.trim(), "pragma solidity 0.4.0;");
      strictEqual(issues[0].issuePointer.linenumber_start, 1);
      strictEqual(issues[0].issuePointer.linenumber_end, 1);
    });
  });
});

describe("UndeclaredStoragePointer", () => {
  describe("in uninitialized_storage_pointer.sol", () => {
    it("should report one uninitialized storage pointer issue on line 10", () => {
      const issues = executeAnalyzer("uninitialised_storage_pointer/crypto_roulette.sol", {
        UndeclaredStoragePointer: {
          active: "true",
          type: "Uninitialised storage pointer",
        },
      });

      strictEqual(issues.length, 1);
      strictEqual(issues[0].contract, "CryptoRoulette");
      strictEqual(issues[0].code.trim(), "Game game;");
      strictEqual(issues[0].issuePointer.linenumber_start, 39);
    });
  });
});
