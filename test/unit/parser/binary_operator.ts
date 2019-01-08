const assert = require("assert");
const expect = require("expect");
const parser = require("solidity-parser-antlr");

import Contract from "../../../src/core/declarations/contract";
import BinaryOperation from "../../../src/core/expressions/binary_operation";
import SolFile from "../../../src/maru/sol_file";
import SolidityAntlr from "../../../src/parser/solidity_antlr";
import NodeUtility from "../../../src/utils/node";
import Source from "../../../src/maru/source";

describe("Binary Operator", () => {
    const file_name = "./test/sol_files/unary/typo_one_command.sol";
    const sol_file = new SolFile(file_name);

    it(`Test case: find binary operators in ${file_name}`, async () => {
        const contracts: Contract[] = sol_file.contracts;

        const bops: BinaryOperation[] = sol_file.sources[0].parseBinaryOperation(contracts[0].location.id);

        expect(bops[0].operator).toEqual("+");
        expect(bops[0].isPure).toEqual(true);

        sol_file.sources[0].printNodes();
    });
});
