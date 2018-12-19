const assert = require("assert");
const expect = require("expect");
const parser = require("solidity-parser-antlr");

import Contract from "../../../src/core/declarations/contract";
import BinaryOperation from "../../../src/core/expressions/binary_operation";
import SolFile from "../../../src/maru/sol_file";
import SolidityAntlr from "../../../src/parser/solidity_antlr";
import NodeUtility from "../../../src/utils/node";

describe("Conditional", () => {
    const file_name = "./test/sol_files/conditional/proxy.sol";
    const sol_file = new SolFile(file_name);

    it(`Test case: find binary operators in ${file_name}`, async () => {
        const contracts: Contract[] = sol_file.contracts_current;

        for (const n of sol_file.nodes) {
            // NodeUtility.printNode(n);
        }
    });
});
