const assert = require("assert");
const expect = require("expect");
const parser = require("solidity-parser-antlr");

import Contract from "../../../src/core/declarations/contract";
import BinaryOperation from "../../../src/core/expressions/binary_operation";
import SolFile from "../../../src/maru/sol_file";
import SolidityAntlr from "../../../src/parser/solidity_antlr";
import NodeUtility from "../../../src/utils/node";
import UnaryOperation from "../../../src/core/expressions/unary_operation";

describe("Unary Operation", () => {
    const file_name = "./test/sol_files/unary/typo_one_command.sol";
    const sol_file = new SolFile(file_name);

    it(`Test case: find binary operators in ${file_name}`, async () => {
        const contracts: Contract[] = sol_file.contracts;

        const uos: UnaryOperation[] = sol_file.sources[0].parseUnaryOperation(contracts[0].location.id);

        //  expect(uos[0].operator).toEqual("+");
        // expect(uos[0].isPure).toEqual(true);

        //  expect(uos[1].operator).toEqual("-");
        // expect(uos[1].isPure).toEqual(true);

        sol_file.sources[0].printNodes();
    });
});
