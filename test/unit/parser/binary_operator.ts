const assert = require("assert");
const expect = require("expect");
const parser = require("solidity-parser-antlr");

import Contract from "../../../src/declarations/contract";
import BinaryOperation from "../../../src/expressions/binary_operation";
import SolFile from "../../../src/maru/sol_file";
import SolidityAntlr from "../../../src/parser/solidity_antlr";
import NodeUtility from "../../../src/utils/node";

describe("Binary Operators", () => {
    const file_name = "./test/sol_files/unary/typo_one_command.sol";
    const sol_file = new SolFile(file_name);

    it(`Test case: find binary operators in ${file_name}`, async () => {
        const contracts: Contract[] = sol_file.contracts_current;

        const bops: BinaryOperation[] = sol_file.parseBinaryOperation(contracts[0].location.id);

        expect(bops[0].operator).toEqual("+");
        expect(bops[0].isPure).toEqual(true);
    });
});
