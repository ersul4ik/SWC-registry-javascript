
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
import SolFile from '../../src/maru/sol_file';
import logger from '../../src/logger/logger';

describe("Function call parsing ", () => {
    const file_name = "./test/sol_files/function_calls/any.sol";
    const sol_file = new SolFile(file_name);

    it(`Test case - should parse function calls in ${file_name}`, async () => {

        const cfunctions: CFunction[] = SolidityAntlr.parseCFunction(sol_file.block);

        let fcs: FunctionCall[] = []
        for (const f of cfunctions) {
            fcs = fcs.concat(SolidityAntlr.parseFunctionCalls(f.block))

        }

        for (const fc of fcs) {
            AstUtility.printNode(fc.name)

        }

        expect(fcs[0].name).toEqual("super.addOne");
        expect(fcs[1].name).toEqual("block.blockhash");
        expect(fcs[2].name).toEqual("blockhash");
    });

});