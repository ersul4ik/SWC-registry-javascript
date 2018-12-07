const assert = require("assert");
const expect = require("expect");
const parser = require("solidity-parser-antlr");

import Contract from "../../../src/declarations/contract";
import BinaryOperation from "../../../src/expressions/binary_operation";
import SolFile from "../../../src/maru/sol_file";
import SolidityAntlr from "../../../src/parser/solidity_antlr";
import StringUtility from "../../../src/utils/ast";

describe("Binary Operators", () => {
    const file_name = "./test/sol_files/unary/typo_one_command.sol";
    const sol_file = new SolFile(file_name);

    it(`Test case - =+/=- ${file_name}`, async () => {
        const contracts: Contract[] = sol_file.contracts_current;

        const bops: BinaryOperation[] = SolidityAntlr.parseBinaryOperation(sol_file.block);

        for (const bop of bops) {
            // AstUtility.printNode(bop)
            if (StringUtility.matchRegex(bop.operator, new RegExp("^=$"))) {
                if (StringUtility.hasProperty(bop.right.branch, "type") && StringUtility.hasProperty(bop.right.branch, "left")) {
                    if (
                        StringUtility.matchRegex(bop.right.branch["type"], new RegExp("^BinaryOperation$")) &&
                        StringUtility.matchRegex(bop.right.branch["operator"], new RegExp("^\\+|-$"))
                    ) {
                    }
                }
            }
        }
    });
});
