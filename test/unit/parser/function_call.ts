const assert = require("assert");
const expect = require("expect");

import FunctionCall from "../../../src/core/expressions/function_call";
import SolFile from "../../../src/maru/sol_file";
import SolidityAntlr from "../../../src/parser/solidity_antlr";
import CFunction from "../../../src/core/declarations/function";
import NodeUtility from "../../../src/utils/node";
import Source from "../../../src/maru/source";

describe("Function call parsing ", () => {
    const file_name1 = "./test/sol_files/function_calls/any.sol";
    const file_name2 = "./test/sol_files/function_calls/old_blockhash.sol";
    const file_name3 = "./test/sol_files/function_calls/arbitrary_location_write_simple.sol";
    const file_name4 = "./test/sol_files/function_calls/FunctionTypes.sol";

    it(`Test case - should parse function calls in ${file_name1}`, async () => {
        const sol_file = new SolFile(file_name1);
        const cfunctions: CFunction[] = sol_file.sources[0].parseFunction();

        let fcs: FunctionCall[] = sol_file.sources[0].parseFunctionCalls(cfunctions[1].location.id);

        expect(fcs[0].member_name1).toEqual("addOne");
        expect(fcs[0].identifier_name).toEqual("super");

        expect(fcs[1].member_name1).toEqual("blockhash");
        expect(fcs[1].identifier_name).toEqual("block");

        expect(fcs[2].member_name1).toEqual("");
        expect(fcs[2].identifier_name).toEqual("blockhash");

        expect(fcs[3].member_name1).toEqual("");
        expect(fcs[3].identifier_name).toEqual("rofl");
    });

    it(`Test case - should parse function calls in ${file_name2}`, async () => {
        const sol_file = new SolFile(file_name2);
        let fcs: FunctionCall[] = sol_file.sources[0].parseFunctionCalls();

        expect(fcs[0].member_name1).toEqual("");
        expect(fcs[0].identifier_name).toEqual("require");

        expect(fcs[4].member_name1).toEqual("");
        expect(fcs[4].identifier_name).toEqual("blockhash");

        expect(fcs[5].member_name1).toEqual("transfer");
        expect(fcs[5].member_name2).toEqual("sender");
        expect(fcs[5].identifier_name).toEqual("msg");
    });

    it(`Test case - should parse function calls in ${file_name3}`, async () => {
        const sol_file = new SolFile(file_name3);

        let fcs: FunctionCall[] = sol_file.sources[0].parseFunctionCalls();

        expect(fcs[1].member_name1).toEqual("push");
        expect(fcs[1].identifier_name).toEqual("bonusCodes");
    });

    it(`Test case - should parse function calls in ${file_name4}`, async () => {
        const sol_file = new SolFile(file_name4);

        let fcs: FunctionCall[] = sol_file.sources[0].parseFunctionCalls();
    });
});
