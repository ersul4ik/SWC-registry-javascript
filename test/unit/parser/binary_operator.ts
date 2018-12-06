const assert = require("assert");
const expect = require("expect");
const parser = require("solidity-parser-antlr");

import Contract from '../../../src/declarations/contract';
import BinaryOperation from '../../../src/expressions/binary_operation';
import SolFile from '../../../src/maru/sol_file';
import SolidityAntlr from '../../../src/parser/solidity_antlr';
import AstUtility from '../../../src/utils/ast';

describe("Binary Operators", () => {
    const file_name = "./test/sol_files/unary/typo_one_command.sol";
    const sol_file = new SolFile(file_name);

    it(`Test case - =+/=- ${file_name}`, async () => {
        const contracts: Contract[] = sol_file.contracts_current;

        const bops: BinaryOperation[] = SolidityAntlr.parseBinaryOperation(sol_file.block);

        for (const bop of bops) {
            // AstUtility.printNode(bop)
            if (AstUtility.matchRegex(bop.operator, new RegExp("^=$"))) {
                if (AstUtility.hasProperty(bop.right.branch, "type") &&
                    AstUtility.hasProperty(bop.right.branch, "left")) {

                    if (AstUtility.matchRegex(bop.right.branch["type"], new RegExp("^BinaryOperation$")) &&
                        AstUtility.matchRegex(bop.right.branch["operator"], new RegExp("^\\+|-$"))) {
                    }

                }
            }
        }

    });

});
