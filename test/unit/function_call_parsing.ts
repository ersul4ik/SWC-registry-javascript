import { should } from 'should/should';
const assert = require("assert");
const expect = require("expect");

import FileUtils from '../../src/utils/file'
import Analyzer from '../../src/maru/analyzer'
import SolidityAntlr from '../../src/parser/solidity_antlr'
import Contract from '../../src/declarations/contract'
import Import from '../../src/declarations/import'
import CFunction from '../../src/declarations/cfunction';
import Variable from '../../src/declarations/variable';
import AstUtility from '../../src/utils/ast';
import ArrayType from '../../src/types/array_type';
import FunctionCall from '../../src/expressions/function_call';

describe("Function call parsing ", () => {
    const file_name = "./test/sol_files/variable/statements.sol";
    const ast = SolidityAntlr.generateAST(file_name);

    it(`Test case - should parse function calls in ${file_name}`, async () => {

        const cfunctions: CFunction[] = SolidityAntlr.parseCFunction(ast);

        for (const f of cfunctions) {

            let fcs: FunctionCall[] = SolidityAntlr.parseFunctionCalls(f.block.branch)
            for (const fc of fcs) {
                AstUtility.printNode(fc.name)
            }
        }
    });

});