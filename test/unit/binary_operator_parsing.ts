const assert = require("assert");
const expect = require("expect");
const parser = require("solidity-parser-antlr");

import { should } from 'should/should';
import FileUtils from '../../src/utils/file'
import Analyzer from '../../src/maru/analyzer'
import SolidityAntlr from '../../src/parser/solidity_antlr'
import Contract from '../../src/declarations/contract'
import Import from '../../src/declarations/import'
import CFunction from '../../src/declarations/cfunction';
import StateVariable from '../../src/declarations/variable';
import AstUtility from '../../src/utils/ast';
import ContractHelper from '../../src/utils/contract';
import SolFile from '../../src/maru/sol_file';
import BinaryOperation from '../../src/expressions/binary_operation';

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
