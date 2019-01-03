const assert = require("assert");
const expect = require("expect");
const parser = require("solidity-parser-antlr");

import Contract from "../../../src/core/declarations/contract";
import BinaryOperation from "../../../src/core/expressions/binary_operation";
import SolFile from "../../../src/maru/sol_file";
import SolidityAntlr from "../../../src/parser/solidity_antlr";
import NodeUtility from "../../../src/utils/node";
import UnaryOperation from "../../../src/core/expressions/unary_operation";

describe("Assigment", () => {
    const file_name = "./test/sol_files/unary/typo_one_command.sol";
    const sol_file = new SolFile(file_name);

    sol_file.sources[0].printNodes();
    for (const n of sol_file.sources[0].getParents(9)) {
        NodeUtility.printNode(n.name);
    }

    it(`Test case: find assignments in ${file_name}`, async () => {
        const contracts: Contract[] = sol_file.contracts;

        const ass: UnaryOperation[] = sol_file.sources[0].parseAssignment(contracts[0].location.id);

        expect(ass[0].operator).toEqual("=");
        expect(ass[0].isPure).toEqual(false);

        expect(ass[1].operator).toEqual("+=");
        expect(ass[1].isPure).toEqual(false);
    });
});
